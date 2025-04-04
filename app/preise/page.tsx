// app/preise/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";

export default function PreisePage() {
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
          Preise & Vorteile
        </motion.h1>

        <div className="space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            Bei <strong>QRContact</strong> bekommst du alles, was du brauchst – ohne Abo, ohne Stress:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Nur 1,99 €</h2>
            <p className="text-gray-600">Einmalig. Kein Abo. Kein Kleingedrucktes.</p>
          </div>

          <hr />

          <h2 className="text-xl font-semibold">Was du bekommst</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ Deinen persönlichen QR-Code – sofort per E-Mail</li>
            <li>✅ Als <strong>PNG</strong> & <strong>druckfertiges PDF</strong></li>
            <li>✅ Anonyme Kontaktmöglichkeit für andere</li>
            <li>✅ Funktioniert ohne App oder Registrierung</li>
            <li>✅ Designed & entwickelt in Deutschland 🇩🇪</li>
            <li>✅ 100 % DSGVO-konform & anonym</li>
          </ul>

          <hr />

          <h2 className="text-xl font-semibold">Für wen ist das gedacht?</h2>
          <p>
            Für alle, die ein Auto, Fahrrad oder Roller besitzen – und erreichbar sein wollen, ohne ihre Telefonnummer preiszugeben. Ideal bei:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>🔌 E-Auto am Ladeplatz</li>
            <li>🚗 Zuparken oder blockierte Einfahrt</li>
            <li>📦 Lieferfahrzeuge mit temporären Stopps</li>
            <li>💬 Anonyme Rückmeldungen oder Hinweise</li>
          </ul>

          <p className="mt-4">
            <strong>QRContact</strong> ist dein smarter Begleiter im Straßenverkehr.
          </p>
        </div>

        {/* Zurück zur Startseite */}
        <div className="text-center mt-10">
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Jetzt QR-Code sichern
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