import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AppToaster } from "@/components/ui/app-toaster/AppToaster";
import "./globals.scss";

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Hello Agencia Creativa",
    template: "%s | Hello Agencia Creativa",
  },
  description:
    "Agencia creativa de Mar del Plata especializada en estrategia, contenido, branding y producción audiovisual.",
  applicationName: "Hello Agencia Creativa",
  authors: [{ name: "Hello Agencia Creativa" }],
  creator: "Hello Agencia Creativa",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Hello Agencia Creativa",
    title: "Hello Agencia Creativa",
    description:
      "Estrategia, diseño y creatividad para marcas que quieren comunicar mejor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hello Agencia Creativa",
    description:
      "Estrategia, diseño y creatividad para marcas que quieren comunicar mejor.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
