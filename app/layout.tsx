"use client";

import { DefaultFooter } from "@/components/sgds/Footer";
import { NavBar } from "@/components/ui/navbar";
import { AuthProvider, useAuth } from "@/lib/context/auth-context";
import { UserProvider } from "@/lib/context/user-context";
import { SgdsMasthead } from "@govtechsg/sgds-masthead-react";
import "@govtechsg/sgds-masthead/dist/sgds-masthead/sgds-masthead.css";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <SgdsMasthead
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
      {user && <NavBar userName={user.name} userUen={user.uen} />}
      <UserProvider initialUser={user}>
        <main>{children}</main>
      </UserProvider>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* <link
          href="https://cdn.jsdelivr.net/npm/@govtechsg/sgds@2.3.6/css/sgds.css"
          rel="stylesheet"
          type="text/css"
        /> */}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <DefaultFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
