"use client";

import React from "react"; // 👈 das ist der Fix!
import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { FaQrcode } from "react-icons/fa";
import Link from "next/link";

console.log("🚀 Page loaded");

export default function Home() {
  const [licensePlate, setLicensePlate] = useState("");
  const [email, setEmail] = useState("");

  const handlePayment = async () => {
    if (!licensePlate || !email) {
      alert("Bitte gib dein Kennzeichen und deine E-Mail ein!");
      return;
    }

    localStorage.setItem("email", email);
    localStorage.setItem("licensePlate", licensePlate);

    try {
      const response = await fetch("http://localhost:5001/api/pay", {
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col items-center px-4 py-12">
      <nav className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 px-6 mb-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-neutral-900">
          <span className="text-blue-600">▦</span>
          <span>qr<span className="text-blue-600">contact</span></span>
        </Link>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/faq" className="hover:underline">FAQ</Link>
          <Link href="/ueber-uns" className="hover:underline">Über uns</Link>
          <Link href="/sicherheit" className="hover:underline">Sicherheit</Link>
          <Link href="/support" className="hover:underline">Support</Link>
        </div>
      </nav>
      <div className="w-full max-w-4xl text-center">
        {/* Logo oben wie auf Landing Page */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaQrcode className="text-blue-600 text-3xl" />
          <Link href="/">
            <span className="text-[2.5rem] font-extrabold tracking-tight cursor-pointer">
              qr<span className="text-blue-600">contact</span>
            </span>
          </Link>
        </div>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Der elegante QR-Code für dein Auto – damit dich andere anonym kontaktieren können, ohne persönliche Daten preiszugeben. Entwickelt für moderne Autobesitzer mit Stil.
        </p>

        <div className="bg-white shadow-2xl rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-medium mb-4">So funktioniert&apos;s:</h2>
          <ol className="list-decimal list-inside text-left text-gray-700 space-y-2">
            <li>Gib dein Kennzeichen und deine E-Mail ein.</li>
            <li>Bestelle deinen persönlichen QR-Code für nur <strong>1,99 €</strong>.</li>
            <li>Drucke ihn aus oder klebe ihn auf dein Auto (z. B. an die Heckscheibe).</li>
            <li>Jeder, der den Code scannt, kann dir eine anonyme Nachricht schicken.</li>
          </ol>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-medium mb-4">Kennzeichen & E-Mail eingeben</h2>
          <input
            type="text"
            placeholder="Kennzeichen (z. B. M-AB1234)"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className="mb-4 w-full p-3 border border-gray-300 rounded-md text-black"
          />

          <input
            type="email"
            placeholder="Deine E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-6 w-full p-3 border border-gray-300 rounded-md text-black"
          />

          {licensePlate && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Deine QR-Code Vorschau</p>
              <div className="inline-block bg-white p-4 rounded-xl shadow-md">
                <QRCode
                  value={`https://qrcontact.de/qrcode/${licensePlate}`}
                  size={140}
                />
              </div>
            </div>
          )}

          <button
            onClick={handlePayment}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Jetzt QR-Code sichern – 1,99 €
          </button>
        </div>

        <div className="text-left bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-xl font-semibold mb-4">Warum QRContact?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>✅ Anonym & sicher – keine Telefonnummer oder persönliche Daten nötig</li>
            <li>✅ Sofort einsatzbereit nach dem Kauf</li>
            <li>✅ Funktioniert mit jedem Smartphone (kein App-Download)</li>
            <li>✅ Ideal bei zugeparkten Autos, Ladeblockierungen oder Hilfe-Situationen</li>
            <li>✅ Designed & entwickelt in Deutschland 🇩🇪</li>
          </ul>
        </div>

        <footer className="mt-12 text-sm text-gray-400">
          © 2025 <span className="font-semibold text-gray-600">qrcontact</span>. Alle Rechte vorbehalten.
        </footer>
      </div>
    </main>
  );
}
