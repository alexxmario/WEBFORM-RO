import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") ||
    "Site-ul tau, construit pentru tine — gestionat pentru totdeauna.";
  const accent = searchParams.get("accent") || "#0EA5E9";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 30%), linear-gradient(135deg, ${accent}, #111827 70%)`,
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.12)",
            fontSize: "18px",
            marginBottom: "20px",
            alignSelf: "flex-start",
          }}
        >
          WebForm • Lansare in 7 zile • Actualizari in 3 zile
        </div>
        <h1 style={{ fontSize: "64px", lineHeight: 1.1, maxWidth: "900px" }}>
          {title}
        </h1>
        <p style={{ marginTop: "20px", fontSize: "26px", opacity: 0.9 }}>
          Platforma completa de creare site-uri web. Gazduire, domeniu si
          actualizari nelimitate incluse.
        </p>
      </div>
    ),
  );
}
