"use client";

import { motion } from "framer-motion";
import { QRCode } from "react-qrcode-logo";
import { FaRegCompass } from "react-icons/fa";
import { useEffect, useState } from "react";

const funFacts = [
  "📱 Wusstest du? QR steht für 'Quick Response'!",
  "🧠 Der erste QR-Code wurde 1994 von Denso Wave in Japan entwickelt!",
  "🚀 QR-Codes können mehr als nur URLs enthalten – auch Wi-Fi-Zugangsdaten oder Visitenkarten!",
  "🔍 Ein QR-Code kann über 4.000 Zeichen speichern!",
  "🎨 Du kannst QR-Codes sogar farbig und mit Logos gestalten – wie bei uns!"
];

export default function NotFoundPage() {
  const [randomFact, setRandomFact] = useState("");
  const [easterEggVisible, setEasterEggVisible] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setRandomFact(funFacts[randomIndex]);
  }, []);

  const handleQrClick = () => {
    setEasterEggVisible(true);
    setTimeout(() => setEasterEggVisible(false), 5000);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 p-6"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <FaRegCompass className="text-blue-500 text-3xl mr-2" />
          <h1 className="text-3xl font-semibold tracking-tight">
            404 – Seite nicht gefunden
          </h1>
        </div>

        <p className="text-gray-600 mb-6">
          Huch! Du hast dich wohl verfahren. Vielleicht hilft dir dieser QR-Code?
        </p>

        <div
          className="bg-gray-100 p-4 rounded-xl mb-4 inline-block cursor-pointer"
          onClick={handleQrClick}
        >
          <QRCode
            value={`https://qrcontact.de`}
            size={140}
            bgColor="#f9fafb"
            fgColor="#111"
          />
        </div>

        {easterEggVisible && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-blue-500 italic mb-4"
          >
            🤫 Psst... nicht jeder verirrt sich zufällig hierher.
          </motion.p>
        )}

        <a
          href="/"
          className="inline-block bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Zurück zur Startseite
        </a>

        {randomFact && (
          <p className="mt-6 text-sm text-gray-500 italic">{randomFact}</p>
        )}
      </motion.div>

      <footer className="mt-12 text-sm text-gray-400 text-center">
        © 2025 <span className="font-semibold text-gray-600">qrcontact</span>. Alles im Griff – auch auf Umwegen.
      </footer>
    </motion.main>
  );
}