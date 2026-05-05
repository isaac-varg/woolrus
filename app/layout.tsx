import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import LoginScreen from "@/components/app/LoginScreen";
import Sidebar from "@/components/app/Sidebar";
import { getUserByEmail } from "@/actions/user/getUserByEmail";
import { getUserPreferences } from "@/lib/preferences/getUserPreferences";
import { getLastSync } from "@/actions/sync/getLastSync";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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
  const user = isAuthenticated ? await getUserByEmail(session?.user?.email || '').catch(() => null) : null;
  const preferences = getUserPreferences(user);
  const locale = await getLocale();
  const messages = await getMessages();
  const lastSyncAt = isAuthenticated ? await getLastSync().catch(() => null) : null;

  return (
    <html lang={locale} data-theme={preferences.theme} >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          {isAuthenticated ? (
            <div className="flex h-screen">
              <Sidebar
                initialCollapsed={preferences.sidebarCollapsed}
                lastSyncAt={lastSyncAt ? lastSyncAt.toISOString() : null}
              />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          ) : (
            <LoginScreen />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
