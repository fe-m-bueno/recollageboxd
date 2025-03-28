import type { Metadata } from "next";
import "./globals.css";
import CollageProvider from "@/context/CollageContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CollageProvider>{children}</CollageProvider>
      </body>
    </html>
  );
}
