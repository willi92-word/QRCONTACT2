"use client";

import { motion } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";
import { useEffect } from "react";

export default function CancelPage() {
  useEffect(() => {
    document.title = "Zahlung abgebrochen – QRContact";
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <FaTimesCircle className="text-red-500 text-3xl mr-2" />
          <h1 className="text-3xl font-semibold tracking-tight">
            Zahlung abgebrochen
          </h1>
        </div>

        <p className="text-gray-600 mb-6">
          Kein Problem – du kannst deinen QR-Code jederzeit später bestellen.
        </p>

        <a
          href="/"
          className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Zurück zur Startseite
        </a>
      </motion.div>

      <footer className="mt-12 text-sm text-gray-400 text-center">
        © 2025 <span className="font-semibold text-gray-600">qrcontact</span>. Alle Rechte vorbehalten.
      </footer>
    </motion.main>
  );
}