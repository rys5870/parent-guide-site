import type { Metadata } from "next";
import { Assistant, Geist_Mono, Heebo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import ClientWrapper from "@/components/ClientWrapper";
import { heIL } from "@clerk/localizations";




const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
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
        className={`${assistant.variable} ${heebo.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
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
