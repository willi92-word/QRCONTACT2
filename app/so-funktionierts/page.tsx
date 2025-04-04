// app/so-funktionierts/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";

export default function FunktionPage() {
  const steps = [
    {
      emoji: "📝",
      title: "Kennzeichen & E-Mail eingeben",
      description: "Gib dein Nummernschild und deine E-Mail an – das dauert keine 10 Sekunden.",
    },
    {
      emoji: "💳",
      title: "QR-Code kaufen",
      description: "Einmalzahlung von nur 1,99 € – sofort digital als PNG & PDF per E-Mail.",
    },
    {
      emoji: "🖨️",
      title: "Drucken, kleben, loslegen",
      description: "QR-Code ausdrucken, laminieren oder aufs Auto kleben. Fertig!",
    },
    {
      emoji: "📬",
      title: "Kontakt erhalten",
      description: "Jemand scannt den Code & schreibt dir – anonym über unser Kontaktformular.",
    },
  ];

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
          So funktioniert’s
        </motion.h1>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{step.emoji}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-blue-600">{step.title}</h3>
                  <p className="text-gray-700 text-sm">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
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