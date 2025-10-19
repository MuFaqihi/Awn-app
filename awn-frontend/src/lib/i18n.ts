// src/lib/i18n.ts
export const locales = ["ar", "en"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "ar";

// describe exactly the fields you read in components
export type Dictionary = {
  brand: string;
  tagline: string;
  nav: {
    home: string;
    therapists: string;
    bookings: string;
    chat: string;
  };
  footer: {
    rights: string;
    saudiTag: string;
  };
  hero: {
    title: string;
    ctaFind: string;
    ctaBookings: string;
  };
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "ar":
      return (await import("./dictionaries/ar")).default as Dictionary;
    case "en":
      return (await import("./dictionaries/en")).default as Dictionary;
    default:
      return (await import("./dictionaries/ar")).default as Dictionary;
  }
}
