"use client";

import "./globals.css";

import { APIProvider } from "@vis.gl/react-google-maps";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  throw Error("Missing environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <APIProvider apiKey={apiKey!}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </APIProvider>
  );
}
