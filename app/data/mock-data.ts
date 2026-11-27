// Datos ficticios del MVP. Único origen de datos hasta que exista backend.
// Equivale a references/templates/data.jsx.

export type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GameAccent = "cyan" | "magenta" | "green" | "yellow";

export interface Game {
  id: string; // slug, ej. "bloque-buster"
  title: string; // ej. "BLOQUE BUSTER"
  short: string; // descripción corta (tarjeta)
  long: string; // descripción larga (detalle)
  category: GameCategory;
  cover: string; // clase CSS de portada, ej. "cover-bricks"
  accent: GameAccent; // color del botón JUGAR en la tarjeta
  bestScore: number; // mejor puntuación global ficticia
  plays: string; // ej. "12.4K", texto ya formateado
}

export interface ScoreEntry {
  rank: number; // 1..N, ordenado por score descendente
  name: string; // de PLAYER_NAMES
  score: number;
  date: string; // "DD/MM/2026", texto fijo
}

export const GAMES: Game[] = [
  {
    id: "bloque-buster",
    title: "BLOQUE BUSTER",
    short: "Rebota la pelota y destruye muros de neón.",
    long: "Pilota una nave-paleta y rebota un núcleo de plasma para pulverizar muros de bloques cromáticos. Cada nivel reorganiza la grilla en patrones imposibles. ¿Hasta dónde llegará tu racha?",
    category: "ARCADE",
    cover: "cover-bricks",
    accent: "cyan",
    bestScore: 28450,
    plays: "12.4K",
  },
  {
    id: "caida",
    title: "CAÍDA",
    short: "Encaja las piezas antes de que el techo te aplaste.",
    long: "Piezas geométricas descienden desde la oscuridad. Rótalas, encástralas y limpia líneas para sobrevivir. La velocidad aumenta sin piedad cada 10 líneas.",
    category: "PUZZLE",
    cover: "cover-tetro",
    accent: "magenta",
    bestScore: 184220,
    plays: "31.8K",
  },
  {
    id: "serpentina",
    title: "SERPENTINA",
    short: "Crece sin morder tu propia cola.",
    long: "Una serpiente de luz recorre la grilla buscando núcleos magenta. Cada bocado la alarga y la hace más veloz. Un movimiento en falso y se devora a sí misma.",
    category: "ARCADE",
    cover: "cover-snake",
    accent: "green",
    bestScore: 7820,
    plays: "9.1K",
  },
  {
    id: "gloton",
    title: "GLOTÓN",
    short: "Devora puntos y escapa de los fantasmas.",
    long: "Un círculo glotón patrulla un laberinto coleccionando puntos luminosos. Cuatro espectros lo persiguen, pero cada cierto tiempo aparece una píldora que invierte los papeles.",
    category: "ARCADE",
    cover: "cover-glot",
    accent: "yellow",
    bestScore: 96400,
    plays: "27.2K",
  },
  {
    id: "invasores",
    title: "INVASORES",
    short: "Defiende el planeta de filas alienígenas.",
    long: "Olas de pixeles hostiles descienden formación tras formación. Mueve tu cañón en horizontal y abre fuego con precisión, antes de que toquen la superficie.",
    category: "SHOOTER",
    cover: "cover-invaders",
    accent: "green",
    bestScore: 54190,
    plays: "18.0K",
  },
  {
    id: "rocas",
    title: "ROCAS",
    short: "Pulveriza asteroides en gravedad cero.",
    long: "Tu nave triangular flota en vacío absoluto. Dispara y rota para dividir rocas en fragmentos cada vez más pequeños. Cuidado con los OVNIs en el horizonte.",
    category: "SHOOTER",
    cover: "cover-rocas",
    accent: "yellow",
    bestScore: 41200,
    plays: "15.6K",
  },
  {
    id: "ranaria",
    title: "RANARIA",
    short: "Cruza la autopista de pixeles.",
    long: "Salta entre carriles de coches a toda velocidad y troncos a la deriva en el río. Llega a los nenúfares antes de que se acabe el tiempo.",
    category: "ARCADE",
    cover: "cover-rana",
    accent: "green",
    bestScore: 18900,
    plays: "6.4K",
  },
  {
    id: "duelo-pixel",
    title: "DUELO PIXEL",
    short: "Dos paletas. Una pelota. Reflejos máximos.",
    long: "El duelo más puro: dos paletas verticales se enfrentan por rebotar una pelota luminosa. Modo solitario contra la CPU o partida local a dos jugadores.",
    category: "VERSUS",
    cover: "cover-duelo",
    accent: "cyan",
    bestScore: 24,
    plays: "4.2K",
  },
];

export const CATEGORIES = ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"] as const;

export const PLAYER_NAMES: string[] = [
  "PX_KAI", "NEONFOX", "Z3R0COOL", "M00NRYU", "VAULT_07", "GLITCHA",
  "ATARI_KID", "CYBER_LU", "MAGENTA88", "SCANLINE", "BIT_LORD", "ARKADYA",
  "DROID_X", "RGB_QUEEN", "PIXEL_DAD", "RETROVIRA", "VECTORX", "JOY_STK",
];

// Misma lógica que seededScores() de la plantilla. Semilla derivada de gameId:
// gameId.length * 17 + 3 (fórmula de la pantalla de detalle).
// Sin Math.random ni Date.now: misma entrada, misma lista.
export function getScores(gameId: string, count: number): ScoreEntry[] {
  let s = gameId.length * 17 + 3;
  const rand = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const used = new Set<string>();
  const rows: ScoreEntry[] = [];

  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = PLAYER_NAMES[Math.floor(rand() * PLAYER_NAMES.length)];
    } while (used.has(name) && used.size < PLAYER_NAMES.length);
    used.add(name);

    const base = Math.floor(50000 + rand() * 250000);
    const score = base - i * Math.floor(2000 + rand() * 4000);
    const day = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
    const mon = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
    rows.push({
      rank: i + 1,
      name,
      score: Math.max(score, 1000),
      date: `${day}/${mon}/2026`,
    });
  }

  return rows
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function getGame(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}
