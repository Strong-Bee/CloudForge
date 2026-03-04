import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function initDB(fileName: string) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
  return filePath;
}

export function getData(fileName: string) {
  const filePath = initDB(fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function saveData(fileName: string, item: any) {
  const filePath = initDB(fileName);
  const data = getData(fileName);
  data.push({ ...item, id: Date.now().toString(), createdAt: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function deleteData(fileName: string, id: string) {
  const filePath = initDB(fileName);
  let data = getData(fileName);
  const itemToDelete = data.find((d: any) => d.id === id);
  data = data.filter((d: any) => d.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return itemToDelete;
}

// Shortcut functions for backward compatibility
export const getWebsites = () => getData("websites.json");
export const saveWebsite = (site: any) => saveData("websites.json", site);
export const deleteWebsite = (id: string) => deleteData("websites.json", id);

