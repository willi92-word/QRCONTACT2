// app/confirmation/page.tsx

"use client";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-semibold mb-6 text-center">✅ Nachricht erfolgreich gesendet!</h1>
        <p className="text-center text-lg">
          Vielen Dank! Deine Nachricht wurde erfolgreich an den Besitzer des Kennzeichens weitergeleitet. Wenn du eine E-Mail angegeben hast, dann hast du eine Bestätigung für den Versand erhalten.
        </p>
      </div>
    </main>
  );
}