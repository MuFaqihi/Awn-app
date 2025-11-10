// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx,mdx}",
  ],
  darkMode: "class", // Changed from ["class"] to "class"
  theme: { extend: {} },
  plugins: [],
} satisfies Config;