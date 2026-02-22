"use client";
import ClientLayout from "@/app/ClientLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}