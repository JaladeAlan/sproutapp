import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ToasterProvider from "./components/ToasterProvider";
import NavigationProgress from "./components/NavigationProgress";
import ConditionalHeader from "./components/ConditionalHeader";
import ConditionalFooter from "./components/ConditionalFooter";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://growthbackend.onrender.com"
  ),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ToasterProvider />
          <NavigationProgress />
          <ConditionalHeader />
          {children}
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}