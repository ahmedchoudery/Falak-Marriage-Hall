import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Falak Marriage Hall | Luxury Wedding Venue Gujrat",
  description:
    "Falak Marriage Hall – The most elegant and luxury wedding venue in Gujrat, Punjab. Premium catering, professional decoration, royal ambience. Book your dream event today.",
  keywords: [
    "marriage hall Gujrat",
    "wedding venue Gujrat",
    "Falak Marriage Hall",
    "luxury wedding hall Punjab",
    "GT Road Gujrat",
  ],
  openGraph: {
    title: "Falak Marriage Hall | Luxury Wedding Venue Gujrat",
    description:
      "Host your dream wedding at Gujrat's most premium marriage hall. 1000+ guests, gourmet catering, royal decor.",
    url: "https://falak-marriage-hall.vercel.app/",
    siteName: "Falak Marriage Hall",
    images: [
      {
        url: "https://falak-marriage-hall.vercel.app/images/hero_bg.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      {/*
        suppressHydrationWarning prevents false hydration mismatches caused
        by browser extensions (e.g. Grammarly) that inject attributes like
        data-gr-ext-installed into <body> after SSR.
      */}
      <body suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}