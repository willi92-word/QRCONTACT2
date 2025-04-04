"use client";

import { useEffect, useState } from "react";

type BackupEntry = {
  timestamp: string;
  email: string;
  licensePlate: string;
  qrUrl: string;
};

export default function AdminPage() {
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/backup")
      .then((res) => res.json())
      .then((data) => {
        setBackups(data);
      });

    const saved = localStorage.getItem("checkedBackups");
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, []);

  const toggleCheck = (timestamp: string) => {
    const updated = checkedItems.includes(timestamp)
      ? checkedItems.filter((t) => t !== timestamp)
      : [...checkedItems, timestamp];

    setCheckedItems(updated);
    localStorage.setItem("checkedBackups", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">📋 Backup Übersicht</h1>

      <div className="grid gap-4">
        {backups.map((entry) => (
          <div
            key={entry.timestamp}
            className="bg-white rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{entry.email}</p>
                <p className="text-sm text-gray-500">
                  {entry.licensePlate} • {entry.timestamp}
                </p>
              </div>
              <input
                type="checkbox"
                checked={checkedItems.includes(entry.timestamp)}
                onChange={() => toggleCheck(entry.timestamp)}
                className="w-5 h-5"
              />
            </div>
            <a
              href={entry.qrUrl}
              target="_blank"
              className="text-blue-600 text-sm hover:underline"
              rel="noopener noreferrer"
            >
              🔗 QR-Code anzeigen
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}