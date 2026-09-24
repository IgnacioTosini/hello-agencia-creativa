type VideoSource =
  | {
      type: "embed";
      url: string;
      provider: "youtube" | "vimeo" | "instagram";
    }
  | { type: "file"; url: string };

const getYouTubeId = (url: URL) => {
  if (url.hostname === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0];
  }

  if (
    url.hostname === "youtube.com" ||
    url.hostname === "www.youtube.com" ||
    url.hostname === "m.youtube.com"
  ) {
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    if (["embed", "shorts", "live"].includes(pathParts[0])) {
      return pathParts[1];
    }
  }

  return null;
};

const getVideoSource = (value: string): VideoSource => {
  try {
    const url = new URL(value);
    const youTubeId = getYouTubeId(url);

    if (youTubeId) {
      return {
        type: "embed",
        url: `https://www.youtube-nocookie.com/embed/${youTubeId}?rel=0`,
        provider: "youtube",
      };
    }

    if (url.hostname === "vimeo.com" || url.hostname === "www.vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];

      if (videoId) {
        return {
          type: "embed",
          url: `https://player.vimeo.com/video/${videoId}`,
          provider: "vimeo",
        };
      }
    }

    if (
      url.hostname === "instagram.com" ||
      url.hostname === "www.instagram.com"
    ) {
      const [contentType, shortcode] = url.pathname.split("/").filter(Boolean);

      if (["p", "reel", "tv"].includes(contentType) && shortcode) {
        return {
          type: "embed",
          url: `https://www.instagram.com/${contentType}/${shortcode}/embed/`,
          provider: "instagram",
        };
      }
    }
  } catch {
    // Si no es una URL embebible, se intenta reproducir como archivo de video.
  }

  return { type: "file", url: value };
};

type ProjectVideoProps = {
  title: string;
  url: string;
  poster?: string;
};

export const ProjectVideo = ({ title, url, poster }: ProjectVideoProps) => {
  const source = getVideoSource(url);

  return (
    <section
      className="projectVideoShowcase"
      aria-labelledby="project-video-title"
    >
      <header>
        <span>Video del proyecto</span>
        <h2 id="project-video-title">{title}, en movimiento.</h2>
      </header>

      <div
        className={`projectDetailVideo ${
          source.type === "embed" && source.provider === "instagram"
            ? "isInstagram"
            : ""
        }`}
      >
        {source.type === "embed" ? (
          <iframe
            src={source.url}
            title={`Video de ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video controls preload="metadata" poster={poster}>
            <source src={source.url} />
            Tu navegador no puede reproducir este video.
          </video>
        )}
      </div>
    </section>
  );
};
