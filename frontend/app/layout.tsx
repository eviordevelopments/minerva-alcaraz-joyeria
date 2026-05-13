import type { Metadata } from "next";
import "./globals.css";
import { DesignSystemProvider } from "../components/DesignSystemProvider";
import { AuthProvider } from "../components/AuthProvider";
import { ArousalOverlay } from "../components/ArousalOverlay";
import { WhatsAppFAB } from "../components/WhatsAppFAB";
import { CookieBanner } from "../components/CookieBanner";
import { AIConcierge } from "../components/AIConcierge";
import { NewsletterBanner, TheCircleBanner } from "../components/FloatingBanners";

export const metadata: Metadata = {
  metadataBase: new URL('https://minervaalcarazjoyeria.mx'),
  title: {
    default: "Minerva Alcaraz Joyería | El Arte de Habitar en la Eternidad",
    template: "Minerva Alcaraz | %s"
  },
  description: "La preservación del arte joyero a través de técnicas ancestrales. Joyería de autor, piezas únicas y colecciones de legado forjadas con maestría en México.",
  keywords: ["joyería artesanal", "diseño de autor", "oro 18k", "plata .925", "piezas únicas", "Minerva Alcaraz", "lujo mexicano"],
  authors: [{ name: "Minerva Alcaraz" }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://minervaalcarazjoyeria.mx',
    siteName: 'Minerva Alcaraz Joyería',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Minerva Alcaraz Joyería - Legado y Maestría'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minerva Alcaraz Joyería',
    description: 'El arte de la joyería ancestral y contemporánea.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <DesignSystemProvider>
          <AuthProvider>
            {children}
            <ArousalOverlay />
            <WhatsAppFAB />
            <CookieBanner />
            <AIConcierge />
            <NewsletterBanner />
            <TheCircleBanner />
          </AuthProvider>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
