import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "SmartCivic | Urban Ecosystem Management",
  description: "Next-gen traffic and waste management for modern urban ecosystems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
