"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

// Erweiterungen aktivieren
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

interface BackupEntry {
  timestamp: string;
  email: string;
  licensePlate: string;
  qrUrl: string;
}

interface SupportMessage {
  id: string;
  email: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [entries, setEntries] = useState<BackupEntry[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Alle");
  const [replyText, setReplyText] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("adminUser");
    const password = localStorage.getItem("adminPass");

    if (!username || !password) {
      router.push("/admin-login");
      return;
    }
    setAdminUser(username);

    fetch("http://localhost:5001/api/admin/backups", {
      headers: { Authorization: "Basic " + btoa(`${username}:${password}`) },
    })
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.entries.sort(
          (a: BackupEntry, b: BackupEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setEntries(sorted);
        setLoaded(true);
      });

    fetch("http://localhost:5001/api/admin/support")
      .then((res) => res.json())
      .then((data) => setSupportMessages(data.messages || []));
  }, [router]);

  const stats = {
    today: entries.filter((e) => dayjs(e.timestamp).isToday()).length,
    yesterday: entries.filter((e) => dayjs(e.timestamp).isYesterday()).length,
    last7: entries.filter((e) => dayjs(e.timestamp).isAfter(dayjs().subtract(7, "day"))).length,
    total: entries.length,
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

    const date = dayjs(entry.timestamp);
    const isTodayMatch = filter === "Heute" && date.isToday();
    const isYesterdayMatch = filter === "Gestern" && date.isYesterday();
    const isLast7DaysMatch = filter === "Letzte 7 Tage" && date.isAfter(dayjs().subtract(7, "day"));

    return (
      matchesSearch &&
      (filter === "Alle" || isTodayMatch || isYesterdayMatch || isLast7DaysMatch)
    );
  });

  const handleReply = async () => {
    if (!replyText || !selectedEmail) return;
    await fetch("http://localhost:5001/api/support-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: selectedEmail, message: replyText }),
    });
    alert("Antwort gesendet an " + selectedEmail);
    setReplyText("");
    setSelectedEmail(null);
  };

  const handlePdfDownload = async (licensePlate: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licensePlate }),
      });
      if (!res.ok) throw new Error("PDF konnte nicht generiert werden.");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-${licensePlate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Fehler beim PDF-Download:", err);
      alert("PDF-Download fehlgeschlagen.");
    }
  };

  const handleResendEmail = async (email: string, licensePlate: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, licensePlate }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ E-Mail wurde erneut an ${email} gesendet.`);
      } else {
        alert("❌ Fehler beim erneuten Senden.");
      }
    } catch (err) {
      console.error("❌ Netzwerkfehler beim Resend:", err);
      alert("Netzwerkfehler beim Senden.");
    }
  };

  const downloadCSV = (): void => {
    fetch("http://localhost:5001/api/export-backup")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Abrufen der CSV-Datei.");
        return res.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "backup.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        console.error("❌ Fehler beim CSV-Export:", err);
        alert("Fehler beim CSV-Download.");
      });
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">📁 Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/admin-login");
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
          >
            🚪 Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b pb-2 text-sm font-medium">
          {[
            ["dashboard", "📄 Bestellungen"],
            ["stats", "📊 Statistik"],
            ["support", "📨 Support"]
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-t-lg border ${
                tab === key ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Inhalte pro Tab */}
        {tab === "dashboard" && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="🔍 Suche E-Mail oder Kennzeichen"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded w-full md:max-w-md"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border p-2 rounded md:w-48"
              >
                <option value="Alle">Alle</option>
                <option value="Heute">Heute</option>
                <option value="Gestern">Gestern</option>
                <option value="Letzte 7 Tage">Letzte 7 Tage</option>
              </select>
            </div>

            {!loaded ? (
              <p>⏳ Lade Bestellungen...</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">📅 Datum</th>
                    <th className="p-2">🕒 Zeit</th>
                    <th className="p-2">📧 E-Mail</th>
                    <th className="p-2">🚗 Kennzeichen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((e, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2">{dayjs(e.timestamp).format("DD.MM.YYYY")}</td>
                      <td className="p-2">{dayjs(e.timestamp).format("HH:mm")}</td>
                      <td className="p-2">{e.email}</td>
                      <td className="p-2">{e.licensePlate}</td>
                      <td className="p-2 text-right">
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            onClick={() => handleResendEmail(e.email, e.licensePlate)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                          >
                            📤 Resend
                          </button>
                          <button
                            onClick={() => handlePdfDownload(e.licensePlate)}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                          >
                            📄 PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={downloadCSV}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                📥 CSV exportieren
              </button>
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-6 bg-blue-50 rounded-xl">
              <h3 className="text-sm text-blue-600 mb-1">📅 Heute</h3>
              <p className="text-2xl font-bold">{stats.today}</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-xl">
              <h3 className="text-sm text-yellow-600 mb-1">🕒 Gestern</h3>
              <p className="text-2xl font-bold">{stats.yesterday}</p>
            </div>
            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="text-sm text-orange-600 mb-1">📈 Letzte 7 Tage</h3>
              <p className="text-2xl font-bold">{stats.last7}</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-sm text-green-600 mb-1">📦 Insgesamt</h3>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        )}

        {tab === "support" && (
          <div className="space-y-4">
            {supportMessages.map((msg, i) => (
              <div key={i} className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-1">📧 {msg.email}</p>
                <p className="text-sm whitespace-pre-wrap mb-2">{msg.message}</p>
                <p className="text-xs text-gray-400">🕒 {dayjs(msg.timestamp).format("DD.MM.YYYY HH:mm")}</p>
                <button
                  onClick={() => setSelectedEmail(msg.email)}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  ✉️ Antworten
                </button>
              </div>
            ))}

            {selectedEmail && (
              <div className="border p-4 rounded-xl bg-white shadow">
                <h4 className="font-semibold mb-2">Antwort an {selectedEmail}</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                  rows={4}
                  placeholder="Deine Antwort hier..."
                />
                <button
                  onClick={handleReply}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  📤 Antwort senden
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  ); 
}