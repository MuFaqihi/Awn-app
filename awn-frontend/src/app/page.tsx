// src/app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en"); // or "/ar" as your default
}