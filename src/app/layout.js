import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Valentine Link Generator - Create a Cute Valentine Page in 30 Seconds 💘",
  description: "Send a personalized 'Will You Be My Valentine?' page that's adorable, shareable, and unforgettable. Choose from cute templates, pay once, and share instantly.",
  keywords: ["valentine", "valentine's day", "valentine page", "romantic message", "love message"],
  openGraph: {
    title: "Valentine Link Generator 💘",
    description: "Create a cute Valentine page in 30 seconds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentine Link Generator 💘",
    description: "Create a cute Valentine page in 30 seconds",
  },
  icons: {
    icon: [
      { url: "/valink.png", sizes: "32x32", type: "image/png" },
      { url: "/valink.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/valink.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
