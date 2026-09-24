export type HomeContentField = {
  id: string;
  label: string;
  value: string;
  multiline?: boolean;
};

export type HomeSectionContent = {
  id: string;
  title: string;
  order: number;
  fields: HomeContentField[];
  heroImageUrl?: string | null;
  heroImagePublicId?: string | null;
  heroDetailImageUrl?: string | null;
  heroDetailImagePublicId?: string | null;
};

export type SiteContent = {
  homeSections: HomeSectionContent[];
  contactBudgets: string[];
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  homeSections: [
    {
      id: "hero",
      title: "Hero principal",
      order: 1,
      heroImageUrl: "/images/hero/branding.webp",
      heroDetailImageUrl: "/images/hero/moodboard.webp",
      fields: [
        {
          id: "label",
          label: "Etiqueta",
          value: "Agencia creativa & estratégica",
        },
        { id: "titleLine1", label: "Título · línea 1", value: "Tu marca no" },
        { id: "titleLine2", label: "Título · línea 2", value: "necesita" },
        { id: "titleLine3", label: "Título · línea 3", value: "publicar más." },
        { id: "titleLine4", label: "Título · línea 4", value: "Necesita" },
        {
          id: "highlightLine1",
          label: "Título destacado · línea 1",
          value: "comunicar",
        },
        {
          id: "highlightLine2",
          label: "Título destacado · línea 2",
          value: "mejor.",
        },
        {
          id: "description",
          label: "Descripción",
          value:
            "Hello combina estrategia, diseño y creatividad para que tu marca se entienda, se recuerde y se elija.",
          multiline: true,
        },
        {
          id: "primaryButton",
          label: "Botón principal",
          value: "Encontrá lo que tu marca necesita",
        },
        {
          id: "secondaryButton",
          label: "Botón secundario",
          value: "Ver proyectos",
        },
      ],
    },
    {
      id: "introduction",
      title: "Introducción",
      order: 2,
      fields: [
        {
          id: "eyebrow",
          label: "Etiqueta",
          value: "Estrategia primero. Diseño con intención.",
        },
        {
          id: "title",
          label: "Texto principal",
          value:
            "Combinamos estrategia, diseño y creatividad para ayudar a las marcas a decir mejor lo que hacen y por qué importa.",
          multiline: true,
        },
      ],
    },
    {
      id: "services",
      title: "Servicios destacados",
      order: 3,
      fields: [
        { id: "eyebrow", label: "Etiqueta", value: "Qué hacemos" },
        { id: "title", label: "Título", value: "Servicios que resuelven" },
        { id: "action", label: "Enlace", value: "Ver todos" },
      ],
    },
    {
      id: "projects",
      title: "Proyectos destacados",
      order: 4,
      fields: [
        { id: "eyebrow", label: "Etiqueta", value: "Portfolio" },
        { id: "title", label: "Título", value: "Proyectos destacados" },
        { id: "action", label: "Enlace", value: "Ver todos" },
      ],
    },
    {
      id: "diagnostic",
      title: "Invitación al diagnóstico",
      order: 5,
      fields: [
        { id: "eyebrow", label: "Etiqueta", value: "Diagnóstico de marca" },
        {
          id: "title",
          label: "Título",
          value: "¿No sabés qué necesita tu marca?",
        },
        {
          id: "description",
          label: "Descripción",
          value: "Respondé tres preguntas y te recomendamos por dónde empezar.",
          multiline: true,
        },
        { id: "button", label: "Botón", value: "Hacer diagnóstico" },
      ],
    },
    {
      id: "process",
      title: "Cómo trabajamos",
      order: 6,
      fields: [
        { id: "eyebrow", label: "Etiqueta", value: "Cómo trabajamos" },
        {
          id: "title",
          label: "Título",
          value: "Un proceso claro, de la idea al resultado",
        },
        {
          id: "step-1-title",
          label: "Paso 1 · título",
          value: "Conocemos tu marca",
        },
        {
          id: "step-1-description",
          label: "Paso 1 · descripción",
          value: "Escuchamos, investigamos y entendemos tu contexto.",
          multiline: true,
        },
        {
          id: "step-2-title",
          label: "Paso 2 · título",
          value: "Definimos una dirección",
        },
        {
          id: "step-2-description",
          label: "Paso 2 · descripción",
          value: "Acordamos un rumbo estratégico y visual.",
          multiline: true,
        },
        {
          id: "step-3-title",
          label: "Paso 3 · título",
          value: "Creamos la propuesta",
        },
        {
          id: "step-3-description",
          label: "Paso 3 · descripción",
          value: "Diseñamos, producimos y refinamos con vos.",
          multiline: true,
        },
        {
          id: "step-4-title",
          label: "Paso 4 · título",
          value: "Le damos vida y medimos",
        },
        {
          id: "step-4-description",
          label: "Paso 4 · descripción",
          value: "Lanzamos, observamos y ajustamos el resultado.",
          multiline: true,
        },
      ],
    },
    {
      id: "contactCta",
      title: "Llamado a contacto",
      order: 7,
      fields: [
        {
          id: "titleLine1",
          label: "Título · línea 1",
          value: "Contanos qué estás",
        },
        {
          id: "titleLine2",
          label: "Título · línea 2",
          value: "construyendo y vemos cómo",
        },
        {
          id: "titleLine3",
          label: "Título · línea 3",
          value: "podemos darle forma.",
        },
        { id: "button", label: "Botón", value: "Hablemos de tu marca" },
      ],
    },
  ],
  contactBudgets: ["A definir", "Hasta $500", "$500 - $1.500", "Más de $1.500"],
};

export const getHomeContentValue = (
  section: HomeSectionContent | undefined,
  fieldId: string,
  fallback: string,
) => section?.fields.find((field) => field.id === fieldId)?.value ?? fallback;
