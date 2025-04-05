"use client";

import React from "react"; // 👈 das ist der Fix!
import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { FaQrcode } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const [licensePlate, setLicensePlate] = useState("");
  const [email, setEmail] = useState("");

  const handlePayment = async () => {
    if (!licensePlate || !email) {
      alert("Bitte gib dein Kennzeichen und deine E-Mail ein!");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, licensePlate }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Fehler beim Starten der Zahlung.");
      }
    } catch (error) {
      console.error("❌ Zahlungsfehler:", error);
      alert("Verbindung zum Server fehlgeschlagen.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">🚘 QRContact</h1>

      <input
        type="text"
        placeholder="Kennzeichen (z. B. M-AB1234)"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
        className="mb-4 p-3 rounded text-black w-full max-w-md"
      />

      <input
        type="email"
        placeholder="Deine E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-3 rounded text-black w-full max-w-md"
      />

      <button
        onClick={handlePayment}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
      >
        QR-Code kaufen
      </button>
    </main>
  );
}
