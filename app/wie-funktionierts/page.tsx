// app/wie-funktionierts/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";

export default function HowItWorksPage() {
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
          className="text-3xl font-bold text-center mb-6"
        >
          Wie funktioniert QRContact?
        </motion.h1>

        <p className="text-center text-gray-600 max-w-xl mx-auto mb-10">
          In drei einfachen Schritten zu deinem anonymen Kontakt-QR fürs Auto – schnell, sicher und stilvoll.
        </p>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-2">📝</div>
            <h2 className="font-semibold text-lg mb-2">Kennzeichen eingeben</h2>
            <p className="text-sm text-gray-600">
              Gib dein Nummernschild und deine E-Mail-Adresse ein – ohne Anmeldung.
            </p>
          </div>

          <div>
            <div className="text-4xl mb-2">💳</div>
            <h2 className="font-semibold text-lg mb-2">QR-Code kaufen</h2>
            <p className="text-sm text-gray-600">
              Bezahle sicher per Stripe und erhalte deinen personalisierten QR-Code sofort per E-Mail.
            </p>
          </div>

          <div>
            <div className="text-4xl mb-2">🚗</div>
            <h2 className="font-semibold text-lg mb-2">Aufkleben & erreichbar sein</h2>
            <p className="text-sm text-gray-600">
              Drucke deinen Code aus, klebe ihn z. B. an die Heckscheibe – und andere können dir schreiben.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Jetzt starten
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
