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
    default: "CallOfCoders - Kush Kumar | Full Stack Developer Portfolio & Online Code Compiler",
    template: "%s | CallOfCoders - Kush Kumar"
  },
  description: "CallOfCoders by Kush Kumar - Full Stack Developer & Software Engineer specializing in JavaScript, TypeScript, React, Next.js, Node.js, Python, Java, C++. Free online code compiler with instant execution, DSA tutorials, web development courses, and programming resources. Build, compile, test, and learn coding online. Join thousands of developers in the coding community.",
  keywords: [
    "Kush Kumar",
    "CallOfCoders", 
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
    "Kush Kumar Portfolio",
    "Kush Kumar Developer",
    "Kush Kumar Projects"
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
    siteName: "CallOfCoders - Kush Kumar",
    title: "CallOfCoders - Kush Kumar | Full Stack Developer & Online Code Compiler",
    description: "Free online code compiler by Kush Kumar - Full Stack Developer. Compile and run JavaScript, Python, TypeScript, Java, C++ code instantly. Learn programming with DSA tutorials and join our developer community.",
    images: [
      {
        url: "https://kushkumar.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "CallOfCoders - Kush Kumar Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CallOfCoders - Kush Kumar | Full Stack Developer & Online Code Compiler",
    description: "Free online code compiler and programming tutorials by Kush Kumar. Compile JavaScript, Python, TypeScript, Java, C++ instantly. Learn coding online.",
    creator: "@kushkumar",
    images: ["https://kushkumar.me/twitter-image.png"],
  },
  alternates: {
    canonical: "https://kushkumar.me",
  },
  category: "technology",
  classification: "Software Development, Online Compiler, Programming Education",
  applicationName: "CallOfCoders",
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
    name: 'CallOfCoders',
    alternateName: 'Kush Kumar Developer Portfolio',
    url: 'https://kushkumar.me',
    description: 'Free online code compiler and programming tutorials by Kush Kumar',
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
    name: 'CallOfCoders',
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
