import type { Metadata } from "next";
import "../styles/globals.css";
import { DesignSystemProvider } from "../components/DesignSystemProvider";
import { WhatsAppFAB } from "../components/WhatsAppFAB";

export const metadata: Metadata = {
  title: "Minerva Alcaraz Joyería | Diseño Eterno Digital",
  description: "Artesanía ancestral en oro y plata. Piezas únicas y exclusivas diseñadas para trascender el tiempo.",
  keywords: ["joyería de lujo", "artesanía", "oro", "plata", "piezas únicas", "Minerva Alcaraz"],
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
