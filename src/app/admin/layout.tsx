import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "./_layout.scss";

export const metadata: Metadata = {
  title: { default: "Administración", template: "%s | Administración Hello" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="adminShell">
      <AdminSidebar />
      {children}
    </div>
  );
}
import type { Metadata } from "next";
