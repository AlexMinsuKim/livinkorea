import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LivinKorea Local Trip MVP",
  description: "Local travel recommendations for foreign travelers in Korea"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
