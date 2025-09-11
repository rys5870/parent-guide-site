import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import ClientWrapper from "@/components/ClientWrapper";
import { heIL } from "@clerk/localizations";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "האתר שלי",
  description: "תיאור קצר לאתר",
  icons: {
    icon: "/favicon.ico", 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

       <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} localization={heIL}  >
          <ClientWrapper>{children}</ClientWrapper>

          <div id="modal-root" />

          <ToastContainer position="top-center" autoClose={3000} />
        </ClerkProvider>
      </body>
    </html>
  );
}
