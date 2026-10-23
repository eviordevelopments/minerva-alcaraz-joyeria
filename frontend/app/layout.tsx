import type { Metadata } from "next";
import "./globals.css";
import { DesignSystemProvider } from "../components/DesignSystemProvider";
import { AuthProvider } from "../components/AuthProvider";
import { MentalStateOverlay } from "../components/MentalStateOverlay";
import { WhatsAppFAB } from "../components/WhatsAppFAB";
import { CookieBanner } from "../components/CookieBanner";
import { AIConcierge } from "../components/AIConcierge";
import { TheCircleBanner } from "../components/FloatingBanners";
import { AccessibilityProvider } from "../components/AccessibilityProvider";
import { AccessibilityFAB } from "../components/AccessibilityFAB";
import { AccessibilityPanel } from "../components/AccessibilityPanel";
import { AdminEditWrapper } from "../components/AdminEditWrapper";
export const metadata: Metadata = {
  metadataBase: new URL('https://minervaalcarazjoyeria.mx'),
  title: {
    default: "Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya",
    template: "Minerva Alcaraz | %s"
  },
  description: "Tu esencia, hecha joya. Minerva Alcaraz Joyería: preservación del arte joyero a través de técnicas artesanales. Joyería de autor, piezas únicas y colecciones de legado forjadas con maestría en México.",
  keywords: [
    "joyería artesanal",
    "diseño de autor",
    "oro 18k",
    "plata .925",
    "piezas únicas",
    "Minerva Alcaraz",
    "Minerva Alcaraz Joyería",
    "lujo mexicano",
    "tu esencia hecha joya",
    "tu esencia, hecha joya",
    "alta orfebrería"
  ],
  authors: [{ name: "Minerva Alcaraz" }],
  creator: "Minerva Alcaraz",
  publisher: "Minerva Alcaraz Joyería",
  applicationName: "Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya",
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://minervaalcarazjoyeria.mx',
    siteName: 'Minerva Alcaraz Joyería',
    title: 'Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya',
    description: 'Tu esencia, hecha joya. Minerva Alcaraz Joyería: preservación del arte joyero a través de técnicas artesanales. Joyería de autor, piezas únicas y colecciones de legado forjadas con maestría en México.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya',
    description: 'Tu esencia, hecha joya. El arte de la joyería artesanal y contemporánea. Joyería de autor y piezas únicas en México.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  other: {
    slogan: 'Tu esencia, hecha joya',
    'brand:slogan': 'Tu esencia, hecha joya',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2C3729" />
        <meta name="slogan" content="Tu esencia, hecha joya" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://minervaalcarazjoyeria.mx/#website",
                  "url": "https://minervaalcarazjoyeria.mx",
                  "name": "Minerva Alcaraz Joyería",
                  "alternateName": [
                    "Minerva Alcaraz",
                    "Minerva Alcaraz Joyas",
                    "Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya"
                  ],
                  "headline": "Tu esencia, hecha joya",
                  "description": "Tu esencia, hecha joya. Minerva Alcaraz Joyería: preservación del arte joyero a través de técnicas artesanales, joyería de autor y piezas únicas en México.",
                  "inLanguage": "es-MX"
                },
                {
                  "@type": "JewelryStore",
                  "@id": "https://minervaalcarazjoyeria.mx/#store",
                  "name": "Minerva Alcaraz Joyería",
                  "url": "https://minervaalcarazjoyeria.mx",
                  "logo": "https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/logo.png",
                  "image": "https://minervaalcarazjoyeria.mx/og-image.jpg",
                  "slogan": "Tu esencia, hecha joya",
                  "description": "Tu esencia, hecha joya. La preservación del arte joyero a través de técnicas artesanales. Joyería de autor, piezas únicas y colecciones de legado forjadas con maestría en México.",
                  "priceRange": "$$$$",
                  "currenciesAccepted": "MXN",
                  "paymentAccepted": "Credit Card, Debit Card, Stripe, OXXO, Cash",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "MX",
                    "addressRegion": "Guanajuato"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://minervaalcarazjoyeria.mx/#organization",
                  "name": "Minerva Alcaraz Joyería",
                  "alternateName": "Minerva Alcaraz",
                  "url": "https://minervaalcarazjoyeria.mx",
                  "logo": "https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/logo.png",
                  "slogan": "Tu esencia, hecha joya",
                  "description": "Tu esencia, hecha joya. Joyería de autor y piezas únicas artesanales en México."
                }
              ]
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var ua = navigator.userAgent || navigator.vendor || (window.opera ? window.opera.toString() : '');
                  var isAndroid = /android/i.test(ua);
                  var isInstagram = /Instagram/i.test(ua) || /FBAN/i.test(ua) || /FBAV/i.test(ua);

                  if (isAndroid && isInstagram) {
                    var path = window.location.pathname || '/';
                    var search = window.location.search || '';
                    var targetUrl = 'minervaalcarazjoyeria.mx' + (path.startsWith('/') ? path : '/' + path) + search;
                    window.location.href = 'intent://' + targetUrl + '#Intent;scheme=https;package=com.android.chrome;end';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AccessibilityProvider>
          <DesignSystemProvider>
            <AuthProvider>
              <AdminEditWrapper>
                {children}
                <MentalStateOverlay />
                <WhatsAppFAB />
                <CookieBanner />
                <AIConcierge />
                <TheCircleBanner />
                <AccessibilityFAB />
                <AccessibilityPanel />
              </AdminEditWrapper>
            </AuthProvider>
          </DesignSystemProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
