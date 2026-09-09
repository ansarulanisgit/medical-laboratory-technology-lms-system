import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { NotificationProvider } from "@/components/ui/notification-context";
import { AuthModalProvider } from "@/components/auth/auth-modal-context";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "LabTutor Academy | Medical Laboratory Technology LMS",
  description:
    "Specialized digital education and competency platform for Diploma in Medical Laboratory Technology & B.Sc. in Health Technology (Laboratory) students in Bangladesh.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1329" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${plusJakartaSans.className}`} suppressHydrationWarning>
      <body className={`${plusJakartaSans.className} ${plusJakartaSans.variable} font-sans min-h-screen bg-background antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NotificationProvider>
            <AuthModalProvider>
              {children}
            </AuthModalProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
