import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";

const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-geologica",
  weight: "400",
});


export const metadata: Metadata = {
  title: "NDGG",
  description: "Websites, brand presence, and digital presentation for modern projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geologica.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}