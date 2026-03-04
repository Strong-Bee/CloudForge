import os from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function verifyOsCredential(username: string, password: string): Promise<boolean> {
  const platform = os.platform();
  
  if (platform === "win32") {
    const safeUser = username.replace(/"/g, '""');
    const safePass = password.replace(/"/g, '""');
    const script = "Add-Type -AssemblyName System.DirectoryServices.AccountManagement; $ctx = New-Object System.DirectoryServices.AccountManagement.PrincipalContext([System.DirectoryServices.AccountManagement.ContextType]::Machine); $ctx.ValidateCredentials('', '')";
    try {
      const { stdout } = await execAsync("powershell -NoProfile -Command ");
      return stdout.trim() === "True";
    } catch (e) {
      return false;
    }
  } else if (platform === "linux") {
    const safeUser = username.replace(/'/g, "'\\''");
    const safePass = password.replace(/'/g, "'\\''");
    const script = "import crypt, spwd\ntry:\n    hash = spwd.getspnam('').sp_pwdp\n    if crypt.crypt('', hash) == hash:\n        print('True')\n    else:\n        print('False')\nexcept:\n    print('False')";
    try {
      const { stdout } = await execAsync("python3 -c ");
      return stdout.trim() === "True";
    } catch (e) {
      try {
        const { stdout } = await execAsync("python -c ");
        return stdout.trim() === "True";
      } catch (fallbackErr) {
        return false;
      }
    }
  }
  return false;
}
