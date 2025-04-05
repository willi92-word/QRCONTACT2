// utils/backup.js (ES-Modul-kompatibel, speichert JSON-Datei)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ __dirname Ersatz für ES-Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function saveBackup(email, licensePlate) {
  const timestamp = new Date().toISOString();

  // 🔹 Zielverzeichnis: /backend/backups/
  const backupDir = path.join(__dirname, "..", "backups");
  const filePath = path.join(backupDir, "backup.json");

  // 🔹 Ordner anlegen, falls nicht vorhanden
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // 🔹 Alte Daten laden oder leeres Array
  let data = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    try {
      data = JSON.parse(content);
    } catch (error) {
      console.error("❌ Fehler beim Parsen von backup.json:", error);
    }
  }

  // 🔹 Neuen Eintrag anhängen
  data.push({
    timestamp,
    email,
    licensePlate,
  });

  // 🔹 Datei aktualisieren
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("✅ Backup gespeichert:", email, licensePlate);
  } catch (err) {
    console.error("❌ Fehler beim Schreiben der Backup-Datei:", err);
  }
}