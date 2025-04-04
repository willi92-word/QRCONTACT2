// app/faq/page.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const faqs = [
  {
    question: "Was ist QRContact?",
    answer:
      "QRContact ist ein smarter QR-Code für dein Auto. Damit können andere dir eine Nachricht schicken, ohne deine persönlichen Daten zu kennen.",
  },
  {
    question: "Wie funktioniert das?",
    answer:
      "Du bestellst einen QR-Code für dein Kennzeichen. Nach dem Scannen gelangen andere auf ein anonymes Kontaktformular, das dir die Nachricht direkt weiterleitet.",
  },
  {
    question: "Muss ich meine Telefonnummer angeben?",
    answer:
      "Nein. Deine Telefonnummer bleibt geheim. Nur deine angegebene E-Mail wird zur Weiterleitung verwendet.",
  },
  {
    question: "Kann ich den Code mehrfach verwenden?",
    answer:
      "Ja! Du kannst den QR-Code ausdrucken, laminieren oder aufkleben. Er funktioniert dauerhaft.",
  },
  {
    question: "Was passiert nach dem Kauf?",
    answer:
      "Du bekommst deinen persönlichen QR-Code als PDF und PNG per E-Mail – sofort bereit zum Ausdrucken oder Weitergeben.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
          </svg>
          <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
            qr<span className="text-blue-600">contact</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">Häufige Fragen (FAQ)</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex justify-between items-center w-full p-4 text-left"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4 text-gray-700"
                >
                  {faq.answer}
                </motion.div>
              )}
            </div>
          ))}
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

      {/* Footer wie im Screenshot */}
      <footer className="mt-12 text-sm text-gray-400 text-center">
        <p className="mb-2">
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <span className="mx-2">|</span>
          <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
        </p>
        <p>© 2025 <span className="font-semibold text-gray-600">qrcontact</span>. Alle Rechte vorbehalten.</p>
      </footer>
    </main>
  );
}