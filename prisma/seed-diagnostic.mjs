import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const steps = [
  {
    id: "diagnostic-need",
    key: "need",
    question: "¿Qué necesitás mejorar?",
    description: "El principal desafío que la marca necesita resolver hoy.",
    displayOrder: 1,
    answers: [
      [
        "need-identity",
        "La identidad de mi marca",
        "identity",
        "branding-identidad-visual",
      ],
      ["need-social", "Mis redes sociales", "social", "diseno-para-redes"],
      [
        "need-content",
        "La calidad de mi contenido",
        "content",
        "produccion-de-contenido",
      ],
      [
        "need-launch",
        "La comunicación de un lanzamiento",
        "launch",
        "campanas-y-lanzamientos",
      ],
      [
        "need-unknown",
        "No sé exactamente qué necesito",
        "unknown",
        "estrategia-de-contenido",
      ],
    ],
  },
  {
    id: "diagnostic-situation",
    key: "situation",
    question: "¿En qué situación está tu marca?",
    description: "El momento actual ayuda a ajustar la recomendación.",
    displayOrder: 2,
    answers: [
      [
        "situation-starting",
        "Estoy empezando",
        "starting",
        "branding-identidad-visual",
      ],
      [
        "situation-active",
        "Ya tengo redes, pero no funcionan como quisiera",
        "active",
        "estrategia-de-contenido",
      ],
      [
        "situation-outdated",
        "Mi identidad quedó desactualizada",
        "outdated",
        "branding-identidad-visual",
      ],
      [
        "situation-growth",
        "Quiero vender o comunicar mejor",
        "growth",
        "campanas-y-lanzamientos",
      ],
      [
        "situation-order",
        "Necesito ordenar mi comunicación",
        "order",
        "estrategia-de-contenido",
      ],
    ],
  },
  {
    id: "diagnostic-business",
    key: "business",
    question: "¿Qué tipo de negocio tenés?",
    description: "El tipo de proyecto termina de contextualizar el resultado.",
    displayOrder: 3,
    answers: [
      [
        "business-entrepreneurship",
        "Emprendimiento",
        "entrepreneurship",
        "branding-identidad-visual",
      ],
      [
        "business-personal",
        "Marca personal",
        "personal",
        "estrategia-de-contenido",
      ],
      ["business-retail", "Comercio", "retail", "campanas-y-lanzamientos"],
      [
        "business-company",
        "Empresa",
        "company",
        "diseno-grafico-piezas-visuales",
      ],
      [
        "business-new-project",
        "Proyecto nuevo",
        "new-project",
        "branding-identidad-visual",
      ],
      ["business-other", "Otro", "other", "estrategia-de-contenido"],
    ],
  },
];

async function seedDiagnostic() {
  const services = await prisma.service.findMany({
    select: { id: true, slug: true },
  });

  for (const step of steps) {
    await prisma.diagnosticStep.upsert({
      where: { id: step.id },
      create: {
        id: step.id,
        key: step.key,
        question: step.question,
        description: step.description,
        displayOrder: step.displayOrder,
      },
      update: {
        key: step.key,
        question: step.question,
        description: step.description,
        displayOrder: step.displayOrder,
      },
    });

    for (const [id, label, value, serviceSlug] of step.answers) {
      const service = services.find((item) => item.slug === serviceSlug);

      await prisma.diagnosticAnswer.upsert({
        where: { id },
        create: {
          id,
          stepId: step.id,
          label,
          value,
          displayOrder:
            step.answers.findIndex((answer) => answer[0] === id) + 1,
          recommendedServiceId: service?.id,
          recommendationWeight: 2,
        },
        update: {
          stepId: step.id,
          label,
          value,
          displayOrder:
            step.answers.findIndex((answer) => answer[0] === id) + 1,
          recommendedServiceId: service?.id,
          recommendationWeight: 2,
        },
      });
    }
  }
}

seedDiagnostic()
  .then(() => {
    console.log("Diagnóstico cargado correctamente.");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
