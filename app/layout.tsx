import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AdminLogin from "@/components/AdminLogin";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kush Kumar | Full Stack Developer & Software Engineer Portfolio",
    template: "%s | Kush Kumar"
  },
  description: "Kush Kumar - Full Stack Developer & Software Engineer specializing in JavaScript, TypeScript, React, Next.js, Node.js, Python, Java, C++. Free online code compiler with instant execution, DSA tutorials, web development courses, and programming resources. Build, compile, test, and learn coding online.",
  keywords: [
    "Kush Kumar",
    "Kush Kumar Developer",
    "Kush Kumar Portfolio",
    "Kush Kumar Full Stack Developer",
    "Kush Kumar Software Engineer",
    "Kush Kumar Projects",
    "Kush Kumar GitHub",
    "Kush Kumar Web Developer",
    "Full Stack Developer",
    "Software Engineer",
    "Online Compiler",
    "Code Compiler",
    "Free Code Editor",
    "Online IDE",
    "JavaScript Compiler",
    "Python Compiler",
    "TypeScript Compiler",
    "Java Compiler",
    "C++ Compiler",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Web Development",
    "Frontend Developer",
    "Backend Developer",
    "DSA Tutorial",
    "Data Structures and Algorithms",
    "Code Learning Platform",
    "Programming Tutorial",
    "Developer Portfolio",
    "Coding Bootcamp",
    "Learn to Code",
    "Programming Course",
    "Developer Community",
    "Code Editor Online",
    "Run Code Online",
    "Execute Code Online",
    "Programming Practice",
    "Coding Practice",
    "Developer Tools",
    "Software Development",
    "Tech Portfolio",
  ],
  authors: [{ name: "Kush Kumar", url: "https://kushkumar.me" }],
  creator: "Kush Kumar",
  publisher: "Kush Kumar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kushkumar.me",
    siteName: "Kush Kumar",
    title: "Kush Kumar | Full Stack Developer & Software Engineer",
    description: "Kush Kumar - Full Stack Developer & Software Engineer. Free online code compiler for JavaScript, Python, TypeScript, Java, C++. Programming tutorials and developer resources.",
    images: [
      {
        url: "https://kushkumar.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kush Kumar - Full Stack Developer & Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kush Kumar | Full Stack Developer & Software Engineer",
    description: "Kush Kumar - Full Stack Developer. Free online code compiler and programming tutorials. JavaScript, Python, TypeScript, Java, C++.",
    creator: "@kushkumar",
    images: ["https://kushkumar.me/twitter-image.png"],
  },
  alternates: {
    canonical: "https://kushkumar.me",
  },
  category: "technology",
  classification: "Software Development, Online Compiler, Programming Education",
  applicationName: "Kush Kumar Developer Platform",
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kush Kumar',
    alternateName: 'Kush Kumar Developer Portfolio',
    url: 'https://kushkumar.me',
    description: 'Full Stack Developer & Software Engineer - Kush Kumar',
    author: {
      '@type': 'Person',
      name: 'Kush Kumar',
      url: 'https://kushkumar.me/about',
      jobTitle: 'Full Stack Developer',
      sameAs: [
        'https://github.com/kushkumar',
        'https://linkedin.com/in/kushkumar',
        'https://twitter.com/kushkumar',
      ],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kushkumar.me/compiler?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Kush Kumar Developer Platform',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '100',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AdminLogin />
            <Navbar />
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
