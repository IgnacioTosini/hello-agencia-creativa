import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const examples = [
  {
    id: "demo-inquiry-diagnostic",
    name: "Sofía Méndez",
    email: "sofia@example.com",
    whatsapp: "5491112345678",
    brandName: "Estudio Norte",
    message:
      "Quiero ordenar la identidad y el contenido antes de lanzar la marca.",
    budget: "$500 - $1.500",
    source: "DIAGNOSTIC",
    status: "NEW",
    serviceId: "branding",
    recommendedServiceId: "branding",
    diagnosticNeed: "identity",
    diagnosticSituation: "starting",
    diagnosticBusiness: "new-project",
  },
  {
    id: "demo-inquiry-contact",
    name: "Martín Suárez",
    email: "martin@example.com",
    brandName: "Casa Oliva",
    message:
      "Necesitamos producir fotos y videos para la nueva temporada de productos.",
    budget: "Más de $1.500",
    source: "CONTACT_FORM",
    status: "CONTACTED",
    serviceId: "content-production",
  },
  {
    id: "demo-inquiry-launch",
    name: "Camila Ríos",
    email: "camila@example.com",
    whatsapp: "5491198765432",
    brandName: "Lumbre",
    message: "Estamos preparando un lanzamiento y necesitamos darle una idea.",
    budget: "A definir",
    source: "CONTACT_FORM",
    status: "NEW",
    serviceId: "campaigns",
  },
];

async function seedInquiries() {
  for (const inquiry of examples) {
    await prisma.inquiry.upsert({
      where: { id: inquiry.id },
      create: inquiry,
      update: {},
    });
  }
}

seedInquiries()
  .then(() => {
    console.log("Consultas de demostración cargadas correctamente.");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
