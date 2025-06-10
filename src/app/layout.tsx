import { Kanit, Mitr } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}