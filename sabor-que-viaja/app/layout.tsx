import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileCta from "@/components/MobileCta";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saborqueviaja.com";

export const metadata: Metadata = {
  title: "Sabor que viaja — Huevos frescos del pueblo a tu mesa",
  description:
    "Suscríbete y recibe huevos frescos de granjas guatemaltecas directamente en tu puerta. Sin intermediarios, 100% naturales. Planes desde Q150/mes.",
  keywords: [
    "huevos frescos Guatemala",
    "huevos por suscripción",
    "huevos del campo",
    "suscripción de huevos",
    "huevos a domicilio Guatemala",
    "del pueblo a tu mesa",
  ],
  authors: [{ name: "Sabor que viaja" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Sabor que viaja — Huevos frescos del pueblo a tu mesa",
    description:
      "Recibe huevos frescos de granjas guatemaltecas cada semana. Directo del campo, sin intermediarios.",
    siteName: "Sabor que viaja",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Sabor que viaja — Huevos frescos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sabor que viaja — Huevos frescos del pueblo a tu mesa",
    description:
      "Recibe huevos frescos de granjas guatemaltecas cada semana. Directo del campo, sin intermediarios.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        <WhatsAppButton />
        <MobileCta />
      </body>
    </html>
  );
}
