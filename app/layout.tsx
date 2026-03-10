import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Microtech | Reparații IT & Service Calculatoare',
  description: 'Service IT profesionist. Reparații calculatoare, laptopuri, instalare Windows și mentenanță rapidă.',
  keywords: ['service it', 'reparații calculatoare', 'instalare windows', 'curățare laptop', 'recuperare date', 'microtech'],
  authors: [{ name: 'Microtech' }],
  openGraph: {
    title: 'Microtech | Service IT',
    description: 'Soluții complete pentru echipamentele tale IT. Programează o vizită acum!',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Microtech',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
