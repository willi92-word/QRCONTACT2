"use client";

import { useParams } from "next/navigation";
import { toPng } from "html-to-image";
import { useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { motion } from "framer-motion";
import ShareButtons from "../../../components/ShareButtons";

export default function QRCodePage() {
  const { licensePlate } = useParams();
  const qrRef = useRef(null);

  const shareUrl = `https://qrcontact.de/qrcode/${licensePlate}`;

  const handleDownload = () => {
    if (!qrRef.current) return;
    toPng(qrRef.current as HTMLElement).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${licensePlate}-qr.png`;
      link.href = dataUrl;
      link.click();
    });
  };

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
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">
          🔲 Dein QR-Code
        </h1>
        <p className="text-base text-gray-500 mb-6">
          Kennzeichen: <strong>{licensePlate}</strong>
        </p>

        <div
          ref={qrRef}
          className="bg-gray-100 p-6 rounded-xl mb-6 flex flex-col items-center"
        >
          <QRCode
            value={`https://qrcontact.de/${licensePlate}`}
            size={160}
            bgColor="#f9fafb"
            fgColor="#111"
          />
        </div>

        <button
          onClick={handleDownload}
          className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 py-2 rounded-xl transition-colors mb-6 w-full"
        >
          QR-Code herunterladen
        </button>

        <ShareButtons shareUrl={shareUrl} />
      </motion.div>
    </motion.main>
  );
}