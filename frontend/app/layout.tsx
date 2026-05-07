import type { Metadata } from "next";
import "../styles/globals.css";
import { DesignSystemProvider } from "../components/DesignSystemProvider";
import { WhatsAppFAB } from "../components/WhatsAppFAB";

export const metadata: Metadata = {
  title: "El Ritual de las Manos que Custodian la Eternidad",
  description: "La preservación del arte joyero a través de técnicas ancestrales. Cada pieza es un testimonio de devoción y maestría, forjada para habitar en la eternidad.",
  keywords: ["joyería artesanal", "herencia", "oro", "plata", "piezas únicas", "Minerva Alcaraz", "maestría joyera"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <DesignSystemProvider>
          {children}
          <WhatsAppFAB />
        </DesignSystemProvider>
      </body>
    </html>
  );
}
