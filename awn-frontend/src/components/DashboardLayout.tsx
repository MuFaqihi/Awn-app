// src/components/DashboardLayout.tsx
"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CalendarDays, LogOut, Heart, Settings, ClipboardList, User, Menu } from "lucide-react";
import { IconBrandTabler, IconArrowLeft } from "@tabler/icons-react";
import { motion } from "motion/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  locale: Locale;
}

// Logo components with responsive sizing
const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 sm:h-6 sm:w-7 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white text-sm sm:text-base"
      >
        Awn
      </motion.span>
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 sm:h-6 sm:w-7 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Mobile menu overlay component
const MobileMenuOverlay = ({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-neutral-900 shadow-xl overflow-y-auto"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <IconArrowLeft className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default function DashboardLayout({ children, locale }: DashboardLayoutProps) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Links exactly like the original but with responsive considerations
  const links = [
    {
      label: ar ? "لوحة التحكم" : "Dashboard",
      href: `/${locale}/dashboard`,
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: ar ? "المواعيد" : "Appointments",
      href: `/${locale}/dashboard/appointments`,
      icon: (
        <CalendarDays className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: ar ? "خطط العلاج" : "Treatment Plans",
      href: `/${locale}/dashboard/plans`,
      icon: (
        <ClipboardList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: ar ? "التاريخ الطبي" : "Medical History",
      href: `/${locale}/dashboard/medical-history`,
      icon: (
        <ClipboardList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: ar ? "المحفوظات" : "Saved",
      href: `/${locale}/dashboard/favorites`,
      icon: (
        <Heart className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: ar ? "الإعدادات" : "Settings",
      href: `/${locale}/dashboard/settings`,
      icon: (
        <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: ar ? "تسجيل الخروج" : "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => {
        alert(ar ? "تم تسجيل الخروج" : "Logged out");
      }
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden bg-gray-50 md:flex-row dark:bg-neutral-800",
        "min-h-screen"
      )}
      dir={ar ? "rtl" : "ltr"}
    >
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Logo />
        <div className="w-10" /> {/* Spacer for balance */}
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
      >
        <div className="space-y-2">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                }
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {link.icon}
              <span className="text-sm font-medium">{link.label}</span>
            </a>
          ))}
        </div>
      </MobileMenuOverlay>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.slice(0, -1).map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Rawan",
                  href: `/${locale}/dashboard/settings`,
                  icon: (
                    <User className="h-7 w-7 shrink-0 text-neutral-700 dark:text-neutral-200" />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full">
        <div className="flex h-full w-full flex-1 flex-col gap-2 bg-white p-2 sm:p-4 md:p-6 lg:p-10 md:rounded-tl-2xl md:border md:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}