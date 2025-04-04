// app/vertrauen/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";

export default function VertrauenPage() {
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

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Sicherheit & Vertrauen
        </motion.h1>

        <div className="space-y-6 text-base leading-relaxed text-gray-700">
          <h2 className="text-xl font-semibold">🛡️ Datenschutz & Sicherheit</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Wir speichern keine Nachrichten dauerhaft.</li>
            <li>Du musst keine Telefonnummer angeben.</li>
            <li>Der QR-Code zeigt nur ein anonymes Kontaktformular.</li>
            <li>Deine E-Mail wird nur zur Weiterleitung verwendet.</li>
          </ul>

          <h2 className="text-xl font-semibold">🧠 Transparente Technik</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Keine App, kein Account nötig.</li>
            <li>Funktioniert mit jedem Smartphone & Browser.</li>
            <li>Gehostet & entwickelt in Deutschland 🇩🇪</li>
          </ul>

          <h2 className="text-xl font-semibold">🙌 Fair & einfach</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Einmal zahlen – dauerhaft nutzen.</li>
            <li>Keine Abo-Fallen oder Zusatzkosten.</li>
            <li>Volle Kontrolle über deinen QR-Code.</li>
          </ul>

          <p className="italic text-gray-500">
            „Wir möchten Vertrauen schaffen, nicht Daten sammeln.“<br />
            – Dein QRContact-Team
          </p>
        </div>

        {/* Zurück zur Startseite */}
        <div className="text-center mt-10">
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Zurück zur Startseite
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-400 text-center">
        <p className="mb-1">
          <Link href="/impressum" className="hover:underline">
            Impressum
          </Link>
          <span className="mx-2">|</span>
          <Link href="/datenschutz" className="hover:underline">
            Datenschutz
          </Link>
        </p>
        <p>
          © 2025 <span className="font-semibold text-gray-600">qrcontact</span>. Alle Rechte vorbehalten.
        </p>
      </footer>
    </main>
  );
}
