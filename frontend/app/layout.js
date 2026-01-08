import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "CoastGuard AI - Mission Control",
  description:
    "Advanced AI-powered coastal surveillance and emergency response system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API}`}
        ></script>
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background-light text-text-dark font-display h-screen flex flex-col overflow-hidden selection:bg-primary selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
