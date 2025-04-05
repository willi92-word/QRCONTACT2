"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!message) return alert("Bitte gib eine Nachricht ein.");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licensePlate: "SUPPORT", // wird im Server als Support erkannt
          message: `[Support-Anfrage]\n\n${message}`,
          email,
        }),
      });

      if (!response.ok) {
        console.error("Fehler beim Senden");
        // oder zeige eine Fehlermeldung in der UI:
        setError("Fehler beim Senden der Nachricht");
      }
    } catch (err) {
      console.error("❌ Fehler beim Versenden:", err);
      alert("Verbindungsfehler. Stelle sicher, dass der Server läuft.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaQrcode className="text-blue-600 text-3xl" />
          <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
            qr<span className="text-blue-600">contact</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">Support kontaktieren</h1>

        {sent ? (
          <p className="text-center text-green-600 font-medium">
            ✅ Deine Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich!
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Deine E-Mail (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black"
            />
            <textarea
              placeholder="Wobei brauchst du Hilfe?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full mb-6 p-3 border border-gray-300 rounded-md text-black"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3 rounded-xl transition-colors"
            >
              Nachricht absenden
            </motion.button>
          </>
        )}

        {/* Zurück zur Startseite */}
        <div className="text-center mt-10">
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-lg transition"
            >
              Zurück zur Startseite
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-400 text-center">
        <p className="mb-1">
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <span className="mx-2">|</span>
          <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
        </p>
        <p>
          © 2025 <span className="font-semibold text-gray-600">qrcontact</span>. Alle Rechte vorbehalten.
        </p>
      </footer>
    </main>
  );
}