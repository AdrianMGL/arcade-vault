import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "96px 16px",
        textAlign: "center",
      }}
    >
      <div
        className="pixel neon-magenta"
        style={{ fontSize: "clamp(48px, 12vw, 96px)", lineHeight: 1 }}
      >
        404
      </div>
      <h1 className="pixel neon-cyan" style={{ fontSize: 14, letterSpacing: "0.08em" }}>
        PÁGINA NO ENCONTRADA
      </h1>
      <p style={{ color: "var(--ink-faint)", maxWidth: 420, margin: 0 }}>
        Esta pantalla no existe en el vault. Revisa la dirección o vuelve a la biblioteca.
      </p>
      <Link href="/" className="btn lg">
        Volver a la biblioteca
      </Link>
    </section>
  );
}
