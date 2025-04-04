// app/beispiele/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";

export default function BeispielePage() {
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
          Anwendungsbeispiele
        </motion.h1>

        <div className="space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            <strong>QRContact</strong> passt sich deinem Alltag an – ganz gleich, wo du ihn nutzt.
            Hier sind ein paar clevere Einsatzmöglichkeiten:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-blue-600 mb-1">🚗 Zuparken & Ladeplätze</h3>
              <p className="text-sm text-gray-700">
                Lass andere wissen, wie sie dich erreichen können, wenn du mal im Weg stehst oder an der Ladesäule bist.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-blue-600 mb-1">📦 Lieferwagen & Transporter</h3>
              <p className="text-sm text-gray-700">
                Ideal für kurze Haltezeiten in zweiter Reihe – ohne deine Nummer weiterzugeben.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-blue-600 mb-1">🚲 Fahrräder & E-Bikes</h3>
              <p className="text-sm text-gray-700">
                Ein QR-Aufkleber am Bike – perfekt für Hinweise, Diebstahlschutz oder kleine Grüße.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-blue-600 mb-1">🛴 E-Scooter & Carsharing</h3>
              <p className="text-sm text-gray-700">
                Gib anderen die Chance, dich zu erreichen – anonym, sicher & direkt.
              </p>
            </div>
          </div>

          <p className="mt-6">
            Dein <strong>QRContact</strong> ist so vielseitig wie dein Alltag. Und genau deshalb lieben ihn unsere Nutzer. 💙
          </p>
        </div>

        {/* Button zurück */}
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