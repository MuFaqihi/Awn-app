import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import "../globals.css";
import Header from "@/components/header";
import FooterSection from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/base-toast";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Awn | عون",
  description: "Physical Therapy Platform",
};

type Dict = Awaited<ReturnType<typeof getDictionary>>;


export default async function RootLayout(props: any) {
  const { children, params } = props;

  // In Next 15, params can be a Promise, so we safely await it
  const resolved = await params;
  const rawLocale = resolved?.locale ?? "en";

  // Normalize to your union type
  const lang = (rawLocale === "ar" ? "ar" : "en") as Locale;
  const dir = lang === "ar" ? "rtl" : "ltr";

  const dict: Dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={cairo.variable}
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider
            position="top-right"
            timeout={5000}
            showCloseButton={true}
          >
            <Header locale={lang} />
            <main
              id="main"
              className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
            >
              {children}
            </main>
            <FooterSection locale={lang} />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}