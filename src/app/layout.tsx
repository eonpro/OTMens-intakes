import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from '@/components/ClientProviders';
import MetaPixel from '@/components/MetaPixel';

export const metadata: Metadata = {
  metadataBase: new URL("https://otmens-intake.vercel.app"),
  title: "Overtime Men's Health - Medical Intake",
  description: "Secure medical intake form for telehealth consultations",
  icons: {
    icon: "https://static.wixstatic.com/shapes/c49a9b_db15345a8c894a89a6d0709e27dbcca1.svg",
    shortcut: "https://static.wixstatic.com/shapes/c49a9b_db15345a8c894a89a6d0709e27dbcca1.svg",
    apple: "https://static.wixstatic.com/shapes/c49a9b_db15345a8c894a89a6d0709e27dbcca1.svg",
  },
  openGraph: {
    title: "Overtime Men's Health - Medical Intake",
    description: "Secure medical intake form for telehealth consultations",
    url: "https://otmens-intake.vercel.app",
    siteName: "Overtime Men's Health",
    images: [
      {
        url: "https://static.wixstatic.com/media/c49a9b_2c301c55e8da43d0afcfb3ac14c576b4~mv2.jpg",
        width: 1200,
        height: 630,
        alt: "Overtime Men's Health Weight Loss Program",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Overtime Men's Health - Medical Intake",
    description: "Secure medical intake form for telehealth consultations",
    images: ["https://static.wixstatic.com/media/c49a9b_2c301c55e8da43d0afcfb3ac14c576b4~mv2.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gdk8cbv.css" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Preload OT Men's Health logo */}
        <link
          rel="preload"
          href="https://static.wixstatic.com/shapes/c49a9b_5139736743794db7af38c583595f06fb.svg"
          as="image"
        />
      </head>
      <body className="font-sofia antialiased bg-white">
        <MetaPixel />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
