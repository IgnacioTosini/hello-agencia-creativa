# Imágenes de proyectos

Revisión: 18 de octubre de 2026.

Las rutas guardadas en la base de datos y en el seed se mantienen. El componente
`ProjectImage` resuelve las imágenes locales mediante imports estáticos: Next.js
genera una URL con hash del contenido, evitando reutilizar una miniatura antigua
en caché al reemplazar un archivo.

## Material recuperado

| Archivo                            | Antes      | Ahora      | Procedencia                                                                                                         |
| ---------------------------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `saint-gottard-cover.jpg`          | 640 × 360  | 1280 × 720 | Primer spot del [carrusel de Hello](https://www.instagram.com/p/DL-ky7Mxdid/), fotograma a 0,1 s del video público. |
| `atlantic-real-estate-cover.jpg`   | 640 × 1138 | 720 × 1280 | Portada original del [reel de Hello](https://www.instagram.com/reel/DdPp49bRzOq/).                                  |
| `atlantic-real-estate-gallery.jpg` | 640 × 1138 | 720 × 1280 | Fotograma a 8,2 s del mismo reel, extraído directamente del video.                                                  |

Los archivos se descargaron o extrajeron a su resolución nativa, sin reescalado
artificial ni generación de contenido. Las URLs temporales del CDN de Instagram
no se utilizan en la web.

## Fuentes que todavía requieren originales

- `saint-gottard-gallery.jpg` conserva 640 × 360: no se encontró una fuente de
  mayor resolución para esa imagen de productos Ice Tea.
- `vitamin-way-sport-cover.jpg` conserva 640 × 1136: la portada pública del
  [reel](https://www.instagram.com/reel/DUBdm0_EQ08/) solo ofrece ese tamaño.

El detalle y el visor conservan las proporciones y limitan la ampliación de los
archivos locales. Las imágenes verticales usan un marco vertical en el detalle;
las tarjetas mantienen su recorte de presentación.

## Próximas cargas

El administrador conserva sin cambios los archivos de hasta 4 MB. Los más pesados
se preparan a un máximo de 3840 px por lado y calidad WebP 94 (90 u 86 solo si es
necesario para entrar en 4 MB). Esto respeta el límite de petición de 4,5 MB de
[Vercel](https://vercel.com/docs/functions/limitations#request-body-size), dejando
margen para el formulario. Antes se convertían todas las fotos a un máximo de
1920 px y calidad 85. Se mantiene el límite de selección de 10 MB.

`next/image` genera las variantes de entrega: calidad 85 para tarjetas y 90 para
detalle y galería. Para futuras portadas horizontales, usar preferentemente
originales de al menos 2400 px de ancho; para verticales, al menos 1080 px de ancho.
