import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "./AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-session";
import "./_login.scss";

export const metadata: Metadata = {
  title: "Acceso administrativo",
  description: "Acceso privado al panel de administración de Hello.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const requestedNext = (await searchParams).next;
  const nextPath =
    typeof requestedNext === "string" && requestedNext.startsWith("/admin")
      ? requestedNext
      : "/admin";

  return (
    <main className="adminLogin">
      <section>
        <Link className="adminLoginBrand" href="/">
          hello<span>.</span>
        </Link>

        <div className="adminLoginHeading">
          <p>Panel administrativo</p>
          <h1>Bienvenido de nuevo.</h1>
          <span>Ingresá tu contraseña para administrar el sitio.</span>
        </div>

        <AdminLoginForm nextPath={nextPath} />

        <Link className="adminLoginBack" href="/">
          ← Volver al sitio
        </Link>
      </section>
    </main>
  );
}
