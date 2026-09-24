import { ContactForm } from "@/components/sections/contact/ContactForm";
import { getSiteContent } from "@/lib/site-content";
import "./_contact-page.scss";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contanos qué estás construyendo y conversemos sobre el próximo paso para tu marca.",
  alternates: { canonical: "/contacto" },
};

type ContactPageProps = {
  searchParams: Promise<{
    servicio?: string;
    diagnostico?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { servicio, diagnostico } = await searchParams;
  const siteContent = await getSiteContent();

  return (
    <>
      <main className="contactPage">
        <header className="contactPageHero">
          <h1>
            Contanos qué estás
            <br />
            construyendo.
          </h1>
          <p>
            Compartimos el momento de tu marca y te ayudamos a pensar un próximo
            paso. Dejanos tus datos y te contactamos para conversar la mejor
            dirección.
          </p>
        </header>
        <ContactForm
          initialService={servicio}
          diagnosticSubmissionId={diagnostico}
          budgetOptions={siteContent.contactBudgets}
        />
      </main>
    </>
  );
}
import type { Metadata } from "next";
