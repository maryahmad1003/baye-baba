import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://baye-baba.vercel.app"),
  title: "Caravane Magal JUDD à Taiba Niassène — J’y serai",
  description:
    "Personnalisez l’affiche avec votre photo et confirmez votre présence à la Caravane Magal JUDD, vendredi 25 décembre. Départ de Médina Baye, passage par Léona Niassène, Taiba Niassène et Kossy, puis retour à Médina Baye.",
  openGraph: {
    title: "Caravane Magal JUDD à Taiba Niassène — J’y serai",
    description:
      "Vendredi 25 décembre : Médina Baye, Léona Niassène, Taiba Niassène, Kossy, puis retour à Médina Baye. Ajoutez votre photo à l’affiche.",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/assets/image.png",
        alt: "Affiche de la Caravane Magal JUDD avec Khadimou Fayda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caravane Magal JUDD à Taiba Niassène — J’y serai",
    description:
      "Vendredi 25 décembre : Médina Baye, Léona Niassène, Taiba Niassène, Kossy, puis retour à Médina Baye.",
    images: ["/assets/image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b6b2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
