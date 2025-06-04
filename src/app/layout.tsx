import type { Metadata } from "next";
import { Kanit, Mitr } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import { ApiStatus } from "../components/ui/APIstatus";

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
  display: 'swap'
});

const mitr = Mitr({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mitr',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "KU Club | ชมรมมหาวิทยาลัยเกษตรศาสตร์",
  description: "ค้นพบและเข้าร่วมชมรมที่ใช่สำหรับคุณ มากกว่า 100 ชมรมรอคุณอยู่",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${kanit.variable} ${mitr.variable}`} suppressHydrationWarning>
      <body className={`${kanit.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <ApiStatus />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}