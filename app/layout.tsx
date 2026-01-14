import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AdminLogin from "@/components/AdminLogin";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CallOfCoders - Kush Kumar | Full Stack Developer Portfolio & Online Code Compiler",
  description: "CallOfCoders by Kush Kumar - Full Stack Developer specializing in JavaScript, TypeScript, React, Next.js, Node.js, Python, Java, C++. Online code compiler, DSA tutorials, and developer resources. Build, compile, and learn programming online.",
  keywords: ["Kush Kumar", "CallOfCoders", "Full Stack Developer", "Online Compiler", "JavaScript", "TypeScript", "React", "Next.js", "Python", "Java", "C++", "DSA", "Web Development", "Code Learning Platform", "Developer Portfolio"],
  authors: [{ name: "Kush Kumar" }],
  creator: "Kush Kumar",
  openGraph: {
    title: "CallOfCoders - Kush Kumar | Full Stack Developer",
    description: "Online code compiler, programming tutorials, and full stack development portfolio by Kush Kumar",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AdminLogin />
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
