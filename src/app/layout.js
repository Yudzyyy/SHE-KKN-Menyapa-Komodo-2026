import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";

// Optimasi font: dimuat oleh Next.js (self-hosted, tidak blocking render)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "SHE Monitoring - KKN PPM UGM Menyapa Komodo 2026",
  description: "Dashboard monitoring keselamatan dan kesehatan KKN PPM UGM Menyapa Komodo 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <head>
        {/* Preconnect untuk mempercepat koneksi ke Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Material Symbols — display=swap agar tidak muncul sebagai teks */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-screen flex overflow-x-hidden font-sans">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="lg:ml-[260px] flex-1 flex flex-col min-h-screen relative w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
