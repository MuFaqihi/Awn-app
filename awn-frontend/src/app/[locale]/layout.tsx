// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import "../globals.css";
import Header from "@/components/header";        // client component
import FooterSection from "@/components/footer"; // server or client, both fine
import { ThemeProvider } from "@/components/theme-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Awn | عون",
  description: "Physical Therapy Platform",
};

// Type helper so TS knows the dict shape coming from getDictionary
type Dict = Awaited<ReturnType<typeof getDictionary>>;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const lang = params.locale;
  const dir = lang === "ar" ? "rtl" : "ltr";

  // infer dictionary type via the Dict alias above
  const dict: Dict = await getDictionary(lang);

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning className={cairo.variable}>
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        {/* next-themes provider (works in both light/dark, no flash) */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Header is a client component that accepts locale + dict */}
          <Header locale={lang} dict={dict} />
          <main id="main" className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <FooterSection />
        </ThemeProvider>
      </body>
    </html>
  );
}