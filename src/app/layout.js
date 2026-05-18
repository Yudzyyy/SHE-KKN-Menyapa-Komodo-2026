import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SHE Monitoring - KKN PPM UGM Menyapa Komodo 2026",
  description: "Dashboard monitoring SHE KKN PPM UGM Menyapa Komodo 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-screen flex overflow-x-hidden">
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
