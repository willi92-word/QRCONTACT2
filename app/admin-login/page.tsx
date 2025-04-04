"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Bitte Benutzername und Passwort eingeben.");
      return;
    }

    // Save in localStorage (wird später im Dashboard für Basic Auth verwendet)
    localStorage.setItem("adminUser", username);
    localStorage.setItem("adminPass", password);

    // Weiterleiten zum Dashboard
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">🔐 Admin Login</h1>

        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded text-gray-800"
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded text-gray-800"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
        >
          Einloggen
        </button>
      </div>
    </main>
  );
}