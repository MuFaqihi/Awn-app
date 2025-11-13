import Login from "@/components/login";
import type { Locale } from "@/lib/i18n";
import { use, Suspense } from "react";

export default function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {locale === "ar" ? "تسجيل الدخول" : "Login"}
        </h1>
        <Suspense fallback={<div className="h-48 flex items-center justify-center">Loading...</div>}>
          <Login locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
