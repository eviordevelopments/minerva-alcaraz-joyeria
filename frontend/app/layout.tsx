import type { Metadata } from "next";
import "./globals.css";
import { DesignSystemProvider } from "../components/DesignSystemProvider";
import { AuthProvider } from "../components/AuthProvider";
import { MentalStateOverlay } from "../components/MentalStateOverlay";
import { WhatsAppFAB } from "../components/WhatsAppFAB";
import { CookieBanner } from "../components/CookieBanner";
import { AIConcierge } from "../components/AIConcierge";
import { TheCircleBanner } from "../components/FloatingBanners";
import { WelcomePopup } from "../components/WelcomePopup";
import { AccessibilityProvider } from "../components/AccessibilityProvider";
import { AccessibilityFAB } from "../components/AccessibilityFAB";
import { AccessibilityPanel } from "../components/AccessibilityPanel";
import { Suspense } from "react";
import { AdminEditWrapper } from "../components/AdminEditWrapper";
import { LaunchCelebrationModal } from "../components/LaunchCelebrationModal";

export const metadata: Metadata = {
  metadataBase: new URL('https://minervaalcarazjoyeria.mx'),
  title: {
    default: "Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya",
    template: "Minerva Alcaraz | %s"
  },
  description: "La preservación del arte joyero a través de técnicas artesanales. Joyería de autor, piezas únicas y colecciones de legado forjadas con maestría en México. Tu esencia, hecha joya.",
  keywords: ["joyería artesanal", "diseño de autor", "oro 18k", "plata .925", "piezas únicas", "Minerva Alcaraz", "lujo mexicano", "tu esencia hecha joya"],
  authors: [{ name: "Minerva Alcaraz" }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://minervaalcarazjoyeria.mx',
    siteName: 'Minerva Alcaraz Joyería',
    title: 'Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya',
    description: 'La preservación del arte joyero a través de técnicas artesanales. Joyería de autor, piezas únicas y colecciones de legado forjadas con maestría en México. Tu esencia, hecha joya.',
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
    description: 'El arte de la joyería artesanal y contemporánea. Tu esencia, hecha joya.',
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
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2C3729" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
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
                <WelcomePopup />
                <Suspense fallback={null}>
                  <LaunchCelebrationModal />
                </Suspense>
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
