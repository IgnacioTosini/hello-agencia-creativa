import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    id: "branding",
    slug: "branding-identidad-visual",
    name: "Branding e identidad visual",
    description:
      "Construimos marcas coherentes, memorables y listas para crecer.",
    problemSolved: "Tu marca se ve improvisada o no logra diferenciarse.",
    recommendedFor: "Marcas nuevas o negocios que necesitan reposicionarse.",
    whatIncludes: [
      "Estrategia de marca",
      "Identidad visual",
      "Manual de uso",
      "Aplicaciones clave",
    ],
    icon: "◇",
    displayOrder: 1,
  },
  {
    id: "content-strategy",
    slug: "estrategia-de-contenido",
    name: "Estrategia de contenido",
    description: "Definimos qué decir, a quién y en qué orden para conectar.",
    problemSolved:
      "Publicás sin una dirección clara ni resultados sostenibles.",
    recommendedFor: "Marcas activas que quieren ordenar su comunicación.",
    whatIncludes: [
      "Auditoría",
      "Pilares de contenido",
      "Tono de voz",
      "Plan editorial",
    ],
    icon: "✧",
    displayOrder: 2,
  },
  {
    id: "social-design",
    slug: "diseno-para-redes",
    name: "Diseño para redes",
    description: "Creamos un sistema visual consistente para cada publicación.",
    problemSolved: "Tu feed no representa el valor real de tu negocio.",
    recommendedFor: "Equipos que necesitan autonomía sin perder identidad.",
    whatIncludes: [
      "Dirección visual",
      "Plantillas",
      "Piezas mensuales",
      "Guía de uso",
    ],
    icon: "⌁",
    displayOrder: 3,
  },
  {
    id: "content-production",
    slug: "produccion-de-contenido",
    name: "Producción de contenido",
    description: "Fotos y videos pensados para contar, no solo para decorar.",
    problemSolved: "Te cuesta mostrar lo que hace especial a tu marca.",
    recommendedFor: "Marcas que necesitan contenido propio y reconocible.",
    whatIncludes: [
      "Dirección creativa",
      "Producción fotográfica",
      "Guiones",
      "Edición",
    ],
    icon: "◉",
    displayOrder: 4,
  },
  {
    id: "campaigns",
    slug: "campanas-y-lanzamientos",
    name: "Campañas y lanzamientos",
    description: "Le damos una idea fuerte a cada momento importante.",
    problemSolved: "Tenés algo nuevo, pero no una historia capaz de movilizar.",
    recommendedFor: "Lanzamientos, temporadas y fechas comerciales.",
    whatIncludes: ["Concepto", "Plan de campaña", "Piezas", "Adaptaciones"],
    icon: "◁",
    displayOrder: 5,
  },
  {
    id: "graphic-design",
    slug: "diseno-grafico-piezas-visuales",
    name: "Diseño gráfico y piezas visuales",
    description: "Resolvemos cada punto de contacto con claridad y oficio.",
    problemSolved: "Tus materiales se sienten desconectados entre sí.",
    recommendedFor: "Marcas con identidad que necesitan desplegarla mejor.",
    whatIncludes: [
      "Editorial",
      "Packaging",
      "Presentaciones",
      "Piezas impresas",
    ],
    icon: "↗",
    displayOrder: 6,
  },
];

const projects = [
  {
    id: "saint-gottard-spots-30-anios",
    slug: "saint-gottard-30-anios",
    title: "Saint Gottard · 30 años",
    clientName: "Saint Gottard",
    year: 2025,
    category: "CAMPAIGNS",
    shortDescription:
      "Una saga de spots para celebrar tres décadas de marca con una mirada inspirada en los años noventa.",
    challenge:
      "Traducir los 30 años de Saint Gottard a una campaña audiovisual capaz de celebrar su historia y reforzar la marca.",
    approach:
      "Hello integró la estrategia con una producción local y una dirección visual que recupera el clima de los años noventa.",
    solution:
      "Producción general de una saga de tres spots para TV abierta, incluyendo vestuario, locaciones, casting y dirección integral.",
    results:
      "Tres piezas audiovisuales terminadas para la campaña aniversario, listas para televisión y comunicación digital.",
    featured: true,
    displayOrder: 1,
    instagramUrl: "https://www.instagram.com/p/DL-ky7Mxdid/",
    videoUrl: "https://www.instagram.com/p/DL-ky7Mxdid/",
    serviceIds: ["campaigns", "content-production"],
    images: [
      {
        id: "saint-gottard-cover",
        url: "/images/projects/saint-gottard-cover.jpg",
        alt: "Spot aniversario producido por Hello para Saint Gottard",
        type: "COVER",
        order: 0,
      },
      {
        id: "saint-gottard-gallery",
        url: "/images/projects/saint-gottard-gallery.jpg",
        alt: "Producción audiovisual de Saint Gottard Ice Tea",
        type: "GALLERY",
        order: 1,
      },
    ],
  },
  {
    id: "atlantic-real-estate-social-media",
    slug: "atlantic-real-estate",
    title: "Atlantic Real Estate",
    clientName: "Atlantic Real Estate",
    year: 2025,
    category: "SOCIAL_MEDIA",
    shortDescription:
      "Una cobertura digital de escala para convertir el encuentro inmobiliario en una experiencia también online.",
    challenge:
      "Acompañar un evento de gran convocatoria con una comunicación capaz de sostener el ritmo antes, durante y después de cada jornada.",
    approach:
      "Diseñamos un proyecto de social media basado en contenido ágil, cobertura en vivo y piezas pensadas para amplificar cada conversación.",
    solution:
      "Producción de 80 cápsulas y 45 transmisiones en vivo, con una cobertura integral del encuentro y sus protagonistas.",
    results:
      "La cobertura alcanzó 1.080.400 visualizaciones y acompañó un evento al que asistieron más de 15.000 personas en dos días.",
    featured: true,
    displayOrder: 2,
    instagramUrl: "https://www.instagram.com/reel/DdPp49bRzOq/",
    videoUrl: "https://www.instagram.com/reel/DdPp49bRzOq/",
    serviceIds: ["content-strategy", "social-design", "content-production"],
    images: [
      {
        id: "atlantic-cover",
        url: "/images/projects/atlantic-real-estate-cover.jpg",
        alt: "Cobertura de Atlantic Real Estate producida por Hello",
        type: "COVER",
        order: 0,
      },
      {
        id: "atlantic-gallery",
        url: "/images/projects/atlantic-real-estate-gallery.jpg",
        alt: "Proyecto de social media para Atlantic Real Estate",
        type: "GALLERY",
        order: 1,
      },
    ],
  },
  {
    id: "vitamin-way-sport",
    slug: "vitamin-way-sport",
    title: "Vitamin Way Sport",
    clientName: "Vitamin Way",
    year: 2026,
    category: "PHOTO_VIDEO",
    shortDescription:
      "Cinco días de rodaje para presentar una nueva línea deportiva en todo el país.",
    challenge:
      "Presentar la línea Sport con una producción capaz de recorrer distintas disciplinas, espacios y perfiles deportivos.",
    approach:
      "Organizamos una producción de múltiples jornadas y locaciones con una dirección visual enérgica y centrada en el movimiento.",
    solution:
      "Producción general, asistencia de dirección, fotografía, escenografía, estilismo y coordinación de talentos y locaciones.",
    results:
      "Una biblioteca audiovisual para presentar la nueva línea Sport a nivel nacional y sostener su comunicación en distintos canales.",
    featured: true,
    displayOrder: 3,
    instagramUrl: "https://www.instagram.com/reel/DUBdm0_EQ08/",
    videoUrl: "https://www.instagram.com/reel/DUBdm0_EQ08/",
    serviceIds: ["campaigns", "content-production"],
    images: [
      {
        id: "vitamin-way-cover",
        url: "/images/projects/vitamin-way-sport-cover.jpg",
        alt: "Rodaje de la campaña Vitamin Way Sport",
        type: "COVER",
        order: 0,
      },
    ],
  },
];

async function seed() {
  for (const service of services) {
    const data = {
      ...service,
      whatIncludes: service.whatIncludes.join("\n"),
      active: true,
    };

    await prisma.service.upsert({
      where: { slug: service.slug },
      create: data,
      update: data,
    });
  }

  await prisma.project.deleteMany({
    where: {
      id: {
        in: ["demo-cafe-horizonte", "demo-vera-estudio", "demo-mesa-viva"],
      },
    },
  });

  for (const project of projects) {
    const { images, serviceIds, ...data } = project;

    const savedProject = await prisma.project.upsert({
      where: { slug: project.slug },
      create: {
        ...data,
        status: "PUBLISHED",
      },
      update: {
        ...data,
        status: "PUBLISHED",
      },
    });

    await prisma.projectImage.deleteMany({
      where: { projectId: savedProject.id },
    });
    await prisma.projectImage.createMany({
      data: images.map((image) => ({
        ...image,
        projectId: savedProject.id,
      })),
    });

    await prisma.projectService.deleteMany({
      where: { projectId: savedProject.id },
    });
    await prisma.projectService.createMany({
      data: serviceIds.map((serviceId) => ({
        projectId: savedProject.id,
        serviceId,
      })),
    });
  }
}

seed()
  .then(() => {
    console.log("Datos iniciales cargados correctamente.");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
