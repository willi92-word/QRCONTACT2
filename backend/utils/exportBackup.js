// backend/utils/exportBackup.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ __dirname-Ersatz für ES-Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function exportBackupAsCSV() {
  const backupPath = path.join(__dirname, "..", "backup.txt");
  const exportPath = path.join(__dirname, "..", "backup.csv");

  // Prüfen ob backup.txt existiert
  if (!fs.existsSync(backupPath)) {
    console.error("❌ Keine backup.txt Datei gefunden.");
    return;
  }

  const lines = fs.readFileSync(backupPath, "utf-8")
    .split("\n")
    .filter(Boolean);

  // Kopfzeile mit QR-Code URL
  const csvRows = ["Datum,Uhrzeit,E-Mail,Kennzeichen,QR-Code-URL"];

  for (const line of lines) {
    const [timestamp, email, licensePlate] = line.split(" - ");
    const [date, time] = timestamp.split("T");
    const qrCodeUrl = `https://qrcontact.de/qrcode/${licensePlate}`;
    csvRows.push(`${date},${time.replace("Z", "")},${email},${licensePlate},${qrCodeUrl}`);
  }

  fs.writeFileSync(exportPath, csvRows.join("\n"), "utf-8");
  console.log("✅ Backup als CSV mit QR-Code-Links exportiert: backup.csv");
}