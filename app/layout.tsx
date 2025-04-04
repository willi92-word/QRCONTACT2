import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "QRContact",
  description: "QR-Code fürs Auto in Sekunden",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="font-sans bg-white text-gray-900">
        {/* Zentriertes Layout für alle Seiten */}
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-xl">{children}</div>
        </main>
      </body>
    </html>
  );
}