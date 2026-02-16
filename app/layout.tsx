import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import LoginScreen from "@/components/app/LoginScreen";
import { getUserByEmail } from "@/actions/user/getUserByEmail";
import { getUserPreferences } from "@/lib/preferences/getUserPreferences";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Woolrus",
  description: "Pick, pack and verify with confidence.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const session = await auth();
  const isAuthenticated = !!session?.user;
  const user = await getUserByEmail(session?.user?.email || '')
  const preferences = getUserPreferences(user);

  return (
    <html lang="en" data-theme={preferences.theme} >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200`}
      >
        {isAuthenticated ? children : <LoginScreen />}
      </body>
    </html>
  );
}
