"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CalendarDays, Settings, ClipboardList, User, BarChart3 } from "lucide-react";
import { IconBrandTabler, IconArrowLeft } from "@tabler/icons-react";
import { motion } from "motion/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  locale: Locale;
}

const Logo = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black dark:text-white"
    >
      Awn
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);

export default function DashboardLayout({ children, locale }: DashboardLayoutProps) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);

  // ✅ فحص تسجيل الدخول باستخدام localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn !== "true") {
      // 🔹 يوجه إلى صفحة تسجيل الدخول الخاصة بالمعالج
      window.location.href = `http://localhost:3000/${locale}/login?role=therapist`;
    }
  }, [locale]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // حذف حالة الدخول
    window.location.href = `/${locale}`; // يرجع للصفحة الرئيسية
  };

  const links = [
    {
      label: ar ? "لوحة التحكم" : "Therapist Dashboard",
      href: `/${locale}/therapist-dashboard`,
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: ar ? "المواعيد" : "Appointments",
      href: `/${locale}/therapist-dashboard/appointments`,
      icon: <CalendarDays className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: ar ? "خطط العلاج" : "Treatment Plans",
      href: `/${locale}/therapist-dashboard/plans`,
      icon: <ClipboardList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    // ✅ سكشن المرضى الجديد
    {
      label: ar ? "المرضى" : "Patients",
      href: `/${locale}/therapist-dashboard/patients`,
      icon: <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: ar ? "متابعة الأداء" : "Performance Overview",
      href: `/${locale}/therapist-dashboard/performance`,
      icon: <BarChart3 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: ar ? "الإعدادات" : "Settings",
      href: `/${locale}/therapist-dashboard/settings`,
      icon: <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "min-h-screen"
      )}
      dir={ar ? "rtl" : "ltr"}
    >
      {/* ✅ Sidebar section */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: ar ? "د. منى" : "Dr. Mona",
                href: `/${locale}/therapist-dashboard/settings`,
                icon: <User className="h-7 w-7 shrink-0 text-neutral-700 dark:text-neutral-200" />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* ✅ Content section */}
      <div className="flex flex-1 flex-col">
        {/* ✅ Mobile header toggle */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setOpen(!open)}
            className="text-neutral-700 dark:text-neutral-200 focus:outline-none"
          >
            {open ? "✕" : "☰"}
          </button>
          <span className="text-lg font-semibold">{ar ? "قائمة" : "Menu"}</span>
        </div>

        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
}