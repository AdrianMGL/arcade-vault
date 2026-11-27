// Sesión simulada. Solo guarda el nombre de usuario en localStorage.
// Todas las lecturas y escrituras van dentro de try/catch: si localStorage
// está bloqueado, la app funciona como invitado.

export interface Session {
  name: string; // máx. 10 caracteres, en mayúsculas
}

const SESSION_KEY = "av_user";
const MAX_NAME_LENGTH = 10;
const DEFAULT_NAME = "PLAYER1";

export function normalizeName(raw: string): string {
  const name = raw.trim().toUpperCase().slice(0, MAX_NAME_LENGTH);
  return name.length > 0 ? name : DEFAULT_NAME;
}

export function readSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as { name?: unknown }).name === "string"
    ) {
      return { name: (parsed as Session).name };
    }
    return null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session): void {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: session.name }));
  } catch {
    // localStorage no disponible: se ignora, la sesión queda solo en memoria.
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage no disponible: nada que borrar.
  }
}
