import type { Metadata } from "next";
import Link from "next/link";
import { PRIVACY_POLICY_VERSION, privacyContact } from "@/lib/privacy";
import "./_privacy-page.scss";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Conocé cómo Hello Agencia Creativa recopila, utiliza y protege los datos enviados desde el sitio.",
  alternates: { canonical: "/privacidad" },
};

const formattedPolicyDate = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${PRIVACY_POLICY_VERSION}T00:00:00.000Z`));

export default function PrivacyPage() {
  const { responsibleName, responsibleLocation, email } = privacyContact;

  return (
    <main className="privacyPage">
      <header className="privacyPageHero">
        <p className="privacyPageEyebrow">Información y transparencia</p>
        <h1>Política de privacidad</h1>
        <p className="privacyPageIntroduction">
          Queremos que sepas qué información recibimos cuando usás este sitio,
          para qué la utilizamos y cómo podés decidir sobre ella.
        </p>
        <p className="privacyPageDate">
          Última actualización: {formattedPolicyDate}
        </p>
      </header>

      <article className="privacyPageContent">
        <section>
          <h2>1. Responsable del tratamiento</h2>
          <p>
            El responsable de los datos recopilados mediante este sitio es
            <strong> {responsibleName}</strong>, con sede en
            <strong> {responsibleLocation}</strong>.
          </p>
          <p>
            Para realizar una consulta sobre privacidad o ejercer tus derechos,
            podés escribir a través de nuestro{" "}
            <Link href="/contacto">formulario de contacto</Link>
            {email ? (
              <>
                {" "}
                o por correo electrónico a{" "}
                <a href={`mailto:${email}`}>{email}</a>
              </>
            ) : null}
            .
          </p>
        </section>

        <section>
          <h2>2. Qué datos recopilamos</h2>
          <p>Podemos recibir la siguiente información:</p>
          <ul>
            <li>
              Nombre, correo electrónico y, si decidís informarlos, WhatsApp y
              nombre de la marca.
            </li>
            <li>
              Servicio de interés, presupuesto estimado y el mensaje enviado
              desde el formulario de contacto.
            </li>
            <li>
              Respuestas elegidas en el diagnóstico y el servicio recomendado a
              partir de ellas.
            </li>
            <li>
              Información técnica básica necesaria para la seguridad y el
              funcionamiento del sitio, como la dirección IP utilizada para
              prevenir envíos abusivos.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Para qué usamos la información</h2>
          <p>Utilizamos estos datos para:</p>
          <ul>
            <li>Responder consultas y conversar sobre posibles proyectos.</li>
            <li>
              Relacionar el resultado del diagnóstico con una consulta enviada
              posteriormente.
            </li>
            <li>
              Comprender qué necesidades se repiten y mejorar los servicios y
              contenidos ofrecidos.
            </li>
            <li>
              Proteger el sitio frente a fraude, abuso o envíos automatizados.
            </li>
          </ul>
          <p>
            No utilizamos la información para tomar decisiones automatizadas con
            efectos legales ni vendemos datos personales.
          </p>
        </section>

        <section>
          <h2>4. Datos obligatorios y consentimiento</h2>
          <p>
            En el formulario de contacto, el nombre y el correo electrónico son
            obligatorios porque permiten identificar y responder la consulta.
            Los demás campos son opcionales, salvo que se indiquen expresamente
            como obligatorios.
          </p>
          <p>
            Al enviar el formulario o completar el diagnóstico, confirmás que
            leíste esta política y autorizás el tratamiento de la información
            para las finalidades detalladas. Podés retirar esa autorización en
            cualquier momento.
          </p>
        </section>

        <section>
          <h2>5. Almacenamiento y proveedores</h2>
          <p>
            El sitio utiliza proveedores de alojamiento, infraestructura web,
            base de datos y gestión de imágenes. Estos proveedores procesan la
            información únicamente para prestar sus servicios técnicos y pueden
            alojarla en servidores ubicados fuera de Argentina.
          </p>
          <p>
            Aplicamos medidas razonables para limitar el acceso y mantener la
            confidencialidad de la información, aunque ningún sistema conectado
            a Internet puede garantizar seguridad absoluta.
          </p>
        </section>

        <section>
          <h2>6. Conservación</h2>
          <p>
            Conservamos las consultas y los resultados de diagnóstico mientras
            sean necesarios para responder, dar seguimiento y analizar la
            demanda de los servicios. Los datos se eliminan o anonimizan cuando
            dejan de ser necesarios o cuando su titular solicita su supresión,
            salvo que exista una obligación legal de conservarlos.
          </p>
        </section>

        <section>
          <h2>7. Con quién compartimos los datos</h2>
          <p>
            No compartimos datos con terceros para que realicen publicidad por
            su cuenta. Solo podrán acceder los proveedores técnicos
            indispensables, las personas autorizadas para responder consultas o
            una autoridad competente cuando exista una obligación legal.
          </p>
        </section>

        <section>
          <h2>8. Tus derechos</h2>
          <p>
            Podés solicitar información sobre los datos que conservamos, acceder
            a ellos y pedir su actualización, corrección o eliminación. También
            podés retirar tu consentimiento para usos futuros.
          </p>
          <p>
            Si considerás que tu solicitud no fue atendida correctamente, podés
            presentar un reclamo ante la{" "}
            <a
              href="https://www.argentina.gob.ar/aaip/datospersonales/derechos"
              target="_blank"
              rel="noreferrer"
            >
              Agencia de Acceso a la Información Pública
            </a>
            .
          </p>
        </section>

        <section>
          <h2>9. Cookies y sesión administrativa</h2>
          <p>
            El área administrativa utiliza una cookie técnica indispensable para
            mantener una sesión segura. No se utiliza con fines publicitarios.
            Si en el futuro incorporamos herramientas de analítica o publicidad
            que requieran consentimiento, informaremos su uso antes de
            activarlas.
          </p>
        </section>

        <section>
          <h2>10. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política cuando cambie el funcionamiento del
            sitio o la normativa aplicable. La fecha publicada al comienzo
            permite identificar la versión vigente.
          </p>
        </section>
      </article>
    </main>
  );
}
