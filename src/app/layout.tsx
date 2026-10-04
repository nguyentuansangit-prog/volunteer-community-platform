import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import { currentAccount } from "@/lib/current-account";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Volunteer Community",
  description: "Khám phá và tham gia các hoạt động tình nguyện vì cộng đồng.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const account = await currentAccount();
  const user = account ? { name: account.name, role: account.role } : null;
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><SiteNavbar key={user ? `${user.name}:${user.role}` : "guest"} user={user} />{children}<SiteFooter /></body>
    </html>
  );
}
