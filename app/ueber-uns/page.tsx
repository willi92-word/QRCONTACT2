// app/ueber-uns/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";

export default function AboutPage() {
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
          Wer wir sind & warum es uns gibt
        </motion.h1>

        <div className="space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            <strong>QRContact</strong> ist ein Herzensprojekt – entstanden aus dem Wunsch,
            modernes Leben einfacher, sicherer und ein bisschen stilvoller zu machen.
          </p>

          <p>
            Wir glauben, dass Kommunikation im Alltag unkompliziert und respektvoll sein sollte –
            gerade im Straßenverkehr, bei Missverständnissen oder kleinen Infos. Deshalb haben
            wir eine Lösung gebaut, die anonym, praktisch und charmant ist.
          </p>

          <hr />

          <h2 className="text-xl font-semibold">Unsere Mission</h2>
          <p>
            Wir möchten Menschen verbinden – ohne ihre Daten preiszugeben. Ob bei einem zugeparkten
            Auto, einer Notiz am Fahrrad oder einer netten Botschaft – <strong>QRContact</strong> macht das möglich.
          </p>

          <p>
            Unsere QR-Codes sind minimalistisch, schnell einsetzbar und sofort verständlich. Keine App, kein Account – einfach scannen & schreiben.
          </p>

          <hr />

          <h2 className="text-xl font-semibold">Was uns wichtig ist</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>✅ Datenschutz & Anonymität</li>
            <li>✅ Simples Design & Funktion</li>
            <li>✅ Ehrlicher Umgang & Transparenz</li>
            <li>✅ Made with ❤️ in Deutschland</li>
          </ul>

          <hr />

          <h2 className="text-xl font-semibold">Das steckt dahinter</h2>
            <p>
            Hi, ich bin Wilhelm 👋 Ich liebe digitale Ideen, die wirklich im Alltag helfen.
            <strong> QRContact</strong> ist genau das: Ein Tool für echte Situationen – ohne Schnickschnack.
            </p>

            <p>
            Die Idee kam mir, als ich eines Tages mein Auto am Straßenrand parkte – eigentlich ganz okay, dachte ich.
            Doch als ich zurückkam, war es weg. Abgeschleppt.
            </p>

            <p>
            Ich erfuhr später: Ein Umzug war angekündigt, das Parkverbot stand auf einem kleinen Schild,
            das ich übersehen hatte. Wäre ich erreichbar gewesen, hätte mich jemand vielleicht gewarnt.
            Stattdessen musste ich über <strong>900 € Abschlepp- und Standgebühren</strong> zahlen.
            </p>

            <p>
            Das war der Moment, in dem ich dachte: Es braucht eine Möglichkeit, wie Menschen einem
            Fahrer anonym und direkt eine Nachricht hinterlassen können – ganz ohne Telefonnummer.
            </p>

            <p>
            Genau dafür ist <strong>QRContact</strong> da.
            </p>

            <p>
            Danke, dass du dabei bist. 🙌
            </p>
        </div>

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
