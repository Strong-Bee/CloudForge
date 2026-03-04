import { NextResponse } from "next/server";
import Docker from "dockerode";
import os from "os";

// Deteksi platform untuk koneksi Docker
const isWin = os.platform() === "win32";
const dockerConfig = isWin 
  ? { socketPath: "//./pipe/docker_engine" } 
  : { socketPath: "/var/run/docker.sock" };

const docker = new Docker(dockerConfig);

export async function GET() {
  try {
    const containers = await docker.listContainers({ all: true });
    return NextResponse.json(containers);
  } catch (error: any) {
    return NextResponse.json({ error: "Docker not running or access denied", details: error.message }, { status: 500 });
  }
}
