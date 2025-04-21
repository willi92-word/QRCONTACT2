"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { QRCode } from "react-qrcode-logo";
import ShareButtons from "../../components/ShareButtons";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
  const [email, setEmail] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const router = useRouter();
  const session_id =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("session_id")
      : null;

  useEffect(() => {
    console.log("🔍 session_id:", session_id);
    if (session_id && typeof session_id === "string") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fulfill-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("📦 Fulfill response:", data);
          if (data.success) {
            setEmail(data.email);
            setLicensePlate(data.licensePlate);
            setEmailSent(true);
          } else {
            console.error("❌ Fehler beim Fulfill:", data.error);
          }
        })
        .catch((err) => {
          console.error("❌ Verbindungsfehler:", err.message);
        });
    }
  }, [session_id]);

  const shareUrl = `https://qrcontact.de/qrcode/${licensePlate}`;

  const downloadQR = () => {
    const qrElement = document.getElementById("qr-code");
    if (!qrElement) return;

    toPng(qrElement, { cacheBust: true, skipFonts: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${licensePlate}-qr.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("❌ QR-Code konnte nicht exportiert werden:", err);
        alert("Fehler beim Herunterladen des QR-Codes.");
      });
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 p-6"
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
        </svg>
        <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
          qr<span className="text-blue-600">contact</span>
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-bold text-green-600 mb-1">✅ Zahlung erfolgreich!</h1>
        <p className="text-sm text-gray-600 mb-6">Dein QR-Code ist bereit. Bist du es auch? 😏</p>

        <p className="text-xs text-red-500 mt-2">Debug: {licensePlate ? `✅ ${licensePlate}` : "❌ Kein Kennzeichen"}</p>

        {licensePlate && (
          <>
            <div id="qr-code" className="bg-gray-100 p-6 rounded-xl mb-4 flex flex-col items-center">
              <QRCode
                value={`https://qrcontact.de/contact/${licensePlate}`}
                size={140}
                bgColor="#f9fafb"
                fgColor="#111"
              />
              <p className="text-sm text-gray-500 italic mt-2">Scanne mich – wenn du dich traust. 👀</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={downloadQR}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 py-3 rounded-xl transition-colors mb-6 w-full"
            >
              QR-Code herunterladen
            </motion.button>

            <ShareButtons shareUrl={shareUrl} />
          </>
        )}

        {emailSent && (
          <p className="mt-6 text-sm text-gray-400 italic">
            📧 E-Mail an <span className="font-medium text-gray-600">{email}</span> wurde verschickt. Viel Spaß mit deinem Code! 🚗
          </p>
        )}
      </motion.div>

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
    </motion.main>
  );
}
