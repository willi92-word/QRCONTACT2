"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const predefinedReasons = [
  "Auto steht im Weg",
  "Licht ist an",
  "Fenster ist offen",
  "Auto beschädigt",
  "Ladeplatz blockiert",
  "Bitte um Rückruf",
];

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { licensePlate } = useParams();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleReasonClick = (reason: string) => {
    setMessage(reason);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const plate = Array.isArray(licensePlate) ? licensePlate[0] : licensePlate;
    const safeMessage = message || "";

    if (!plate || !safeMessage) {
      alert("Bitte fülle alle Pflichtfelder aus.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("message", safeMessage);
    formData.append("licensePlate", plate);
    formData.append("email", email);
    if (file) formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5001/api/contact", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        alert("Es gab ein Problem beim Senden der Nachricht.");
      }
    } catch (error) {
      console.error("❌ Fehler beim Senden der Nachricht:", error);
      alert("Fehler beim Senden der Nachricht.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 text-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Erfolgreich gesendet!</h1>
          <p className="text-gray-600">Deine Nachricht wurde übermittelt und wird bald weitergeleitet. 🚀</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
        <svg
            className="w-9 h-9 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
        </svg>
        <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
            qr<span className="text-blue-600">contact</span>
        </span>
        </div>
        
        <h1 className="text-3xl font-semibold mb-2 text-center">
        📮 Kontaktaufnahme für:
        </h1>
        <p className="text-2xl font-bold text-blue-600 text-center mb-6">
        {decodeURIComponent(licensePlate as string)}
        </p>

        <div className="mb-6">
          <p className="text-sm mb-2">💬 Schnellauswahl für Nachricht:</p>
          <div className="flex flex-wrap gap-2">
            {predefinedReasons.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => handleReasonClick(reason)}
                className="px-3 py-1 bg-gray-100 text-sm rounded-xl border border-gray-300 hover:bg-blue-100"
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">✉️ Nachricht *</label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              📧 Deine E-Mail (optional)
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Wenn du deine E-Mail angibst, wird diese an den Fahrzeugbesitzer weitergeleitet.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">📎 Bild anhängen (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-xl"
            />
          </div>
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded-xl font-medium transition-colors bg-black hover:bg-gray-900`}
          >
            {loading ? "⏳ Wird gesendet..." : "🚀 Nachricht absenden"}
          </motion.button>
          <p className="text-xs text-gray-500 text-center mt-2">
            (Nachricht wird anonym an den Fahrzeugbesitzer weitergeleitet)
          </p>
        </form>
      </motion.div>
    
    </main>
  );
}
