# SPEC 01 — MVP de pantallas visuales de Arcade Vault

> **Estado:** Aprobado
> **Depende de:** ninguna (primera spec del proyecto)
> **Fecha:** 2026-11-26
> **Objetivo:** Implementar en Next.js las cinco pantallas de `references/templates/` como UI visual con datos ficticios en `app/data/`, sin implementar ningún juego.

---

## Por qué existe esta spec

`references/templates/` contiene un prototipo en HTML con React y Babel en el navegador. Hay que convertirlo en la aplicación real del proyecto (Next.js 16, App Router, Tailwind v4), con rutas reales y una estructura que pueda recibir datos de una base de datos más adelante. Los datos ficticios viven en un único punto (`app/data/`) para que el reemplazo posterior no toque las pantallas.

---

## Scope

**In:**

- Las cinco pantallas de la plantilla, cada una como ruta del App Router:
  - `/` — Biblioteca (`biblioteca.jsx`).
  - `/juegos/[id]` — Detalle del juego (`detalle.jsx`).
  - `/jugar/[id]` — Reproductor, en modo placeholder (`reproductor.jsx`).
  - `/salon` — Salón de la Fama (`salon.jsx`).
  - `/acceder` — Inicio de sesión (`auth.jsx`).
- Barra de navegación (`nav.jsx`) con menú móvil y pie de página (`app.jsx`), presentes en todas las rutas.
- Datos ficticios en `app/data/` (equivalente de `data.jsx`), tipados.
- Sesión simulada: el inicio de sesión guarda solo el nombre de usuario en `localStorage`. No hay validación de contraseña.
- Estilos: la plantilla ya está portada en `app/globals.css` (tema, clases `av-*`, `btn`, `chip`, `card`, etc.). Se reutilizan sin rediseñar.
- Diseño responsivo: menú hamburguesa en móvil y ninguna pantalla con scroll horizontal a 360 px.
- Metadatos de `app/layout.tsx`: `lang="es"`, título y descripción de Arcade Vault.

**Out of scope (para specs futuras):**

- Cualquier juego real o simulado: no hay motor, no hay física, no hay enemigos en movimiento ni contador de puntos que suba solo.
- Guardar puntuaciones (`av_scores`) y cualquier escritura de puntajes.
- Base de datos, API, o cualquier backend. Los datos de `app/data/` son el único origen.
- Inicio de sesión con Google o GitHub. Los botones se eliminan del MVP.
- Pestaña "Crear cuenta" y registro de usuarios.
- Validación real de usuario o contraseña.
- Búsqueda y filtros reflejados en la URL (query params).
- Tests automatizados (Vitest, Playwright u otro runner). Se evaluará en una spec propia.
- Pantalla de juego completa, controles de teclado/táctil y modo de dos jugadores de DUELO PIXEL.

---

## Data model

Ningún dato se persiste salvo la sesión. Los datos ficticios viven en `app/data/mock-data.ts`.

```ts
// app/data/mock-data.ts
export type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GameAccent = "cyan" | "magenta" | "green" | "yellow";

export interface Game {
  id: string;            // slug, ej. "bloque-buster"
  title: string;         // ej. "BLOQUE BUSTER"
  short: string;         // descripción corta (tarjeta)
  long: string;          // descripción larga (detalle)
  category: GameCategory;
  cover: string;         // clase CSS de portada, ej. "cover-bricks"
  accent: GameAccent;    // color del botón JUGAR en la tarjeta
  bestScore: number;     // mejor puntuación global ficticia
  plays: string;         // ej. "12.4K", texto ya formateado
}

export interface ScoreEntry {
  rank: number;          // 1..N, ordenado por score descendente
  name: string;          // de PLAYER_NAMES
  score: number;
  date: string;          // "DD/MM/2026", texto fijo
}

// app/lib/session.ts
export interface Session {
  name: string;          // máx. 10 caracteres, en mayúsculas
}
```

Constantes exportadas desde `app/data/mock-data.ts`:

- `GAMES: Game[]` — los 8 juegos de `data.jsx`, mismos títulos, textos, categorías, portadas y cifras.
- `CATEGORIES = ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]`.
- `PLAYER_NAMES: string[]` — los 18 nombres de `data.jsx`.
- `getScores(gameId: string, count: number): ScoreEntry[]` — generador determinista con la misma semilla que `seededScores` de la plantilla, derivada de `gameId`. Debe devolver siempre la misma lista para el mismo `gameId`, sin usar `Math.random` ni `Date.now`.
- `getGame(id: string): Game | undefined`.

Convenciones:

- Las puntuaciones se muestran con `toLocaleString("es-ES")`.
- Ningún dato usa `new Date()`. Las fechas son texto fijo.

**Sesión.** Clave de `localStorage`: `av_user`. Valor: `JSON.stringify({ name })`. Se lee y escribe solo desde `app/lib/session.ts`, siempre dentro de `try/catch`. Si el valor no existe o no se puede leer, la sesión es `null` (invitado).

---

## Implementation plan

Cada paso deja la aplicación compilando y navegable.

1. **Datos.** Crear `app/data/mock-data.ts` con los tipos, `GAMES`, `CATEGORIES`, `PLAYER_NAMES`, `getScores` y `getGame`. Verificar: `npx tsc --noEmit` pasa.
2. **Sesión.** Crear `app/lib/session.ts` (`readSession`, `writeSession`, `clearSession`, con try/catch) y `app/components/session-provider.tsx` (proveedor cliente que lee la sesión en `useEffect` y expone `session`, `signIn(name)`, `signOut()`). Verificar: `npx tsc --noEmit` pasa.
3. **Layout.** Actualizar `app/layout.tsx`: `lang="es"`, metadatos, envolver `children` con `SessionProvider`. Verificar: `npm run build` pasa y la página por defecto se sigue viendo.
4. **Barra y pie.** Crear `app/components/nav.tsx` (logo, enlaces, botón de sesión, menú móvil) y `app/components/footer.tsx`. Montarlos en `layout.tsx`. Verificar: en `/` se ven barra y pie, y el menú móvil abre y cierra.
5. **Biblioteca.** Reemplazar `app/page.tsx` por la biblioteca: hero, buscador, chips de categoría, cuadrícula de `game-card.tsx` (con efecto de inclinación con el mouse), estado vacío "NO HAY RESULTADOS". Verificar: buscar y filtrar cambian la cuadrícula; clic en una tarjeta lleva a `/juegos/[id]`.
6. **Detalle.** Crear `app/juegos/[id]/page.tsx` con portada, etiquetas, estadísticas, tabla de mejores puntuaciones (10 filas) y botones JUGAR AHORA y VOLVER AL VAULT. Id desconocido: `notFound()`. Crear `app/not-found.tsx` con el estilo del tema. Verificar: `/juegos/bloque-buster` renderiza y `/juegos/no-existe` muestra la página de no encontrado.
7. **Reproductor (placeholder).** Crear `app/jugar/[id]/page.tsx` y `app/components/game-placeholder.tsx`: HUD con jugador (nombre de sesión o INVITADO), puntuación 0, vidas fijas, nivel 01; área CRT con el fondo de cuadrícula y la nave, sin enemigos; barra inferior "SEÑAL OK"; botones PAUSA (muestra "EN PAUSA" y cambia a REANUDAR), FIN (muestra el modal "FIN DEL JUEGO" con puntuación 0) y SALIR (vuelve a `/juegos/[id]`). Id desconocido: `notFound()`. Verificar: PAUSA y FIN cambian el estado visual; SALIR navega.
8. **Salón de la Fama.** Crear `app/salon/page.tsx` con pestañas por juego, podio de tres posiciones, tabla de 12 filas y, con sesión iniciada, la fila "TU MEJOR MARCA". Verificar: cambiar de pestaña actualiza podio y tabla; con sesión aparece la fila del usuario.
9. **Acceso.** Crear `app/acceder/page.tsx` y `app/components/auth-form.tsx`: campos Usuario y Contraseña, botón ENTRAR AL VAULT (guarda sesión y va a `/`), botón JUGAR COMO INVITADO (borra sesión y va a `/`). Sin pestaña de registro ni botones sociales. Verificar: iniciar sesión cambia la barra a nombre de usuario; cerrar sesión desde la barra la devuelve a "Iniciar Sesión".
10. **Verificación final.** Ejecutar `npm run lint`, `npx tsc --noEmit` y `npm run build`. Comparar visualmente las cinco rutas contra `references/templates/Arcade Vault.html` en 1440 px y 390 px, y revisar 360 px sin scroll horizontal.

---

## Acceptance criteria

- [ ] `npm run build` termina sin errores.
- [ ] `npm run lint` termina sin errores.
- [ ] `npx tsc --noEmit` termina sin errores.
- [ ] Existen las rutas `/`, `/juegos/[id]`, `/jugar/[id]`, `/salon` y `/acceder`.
- [ ] `app/data/mock-data.ts` contiene los 8 juegos de `data.jsx` con los mismos títulos y categorías.
- [ ] Ningún archivo de `app/` llama a `Math.random` ni a `Date.now`.
- [ ] Ningún archivo del proyecto implementa lógica de juego (no hay bucle de juego, no hay `setInterval` que sume puntos).
- [ ] La cuadrícula de la biblioteca muestra 8 tarjetas sin filtros activos.
- [ ] Escribir "bloque" en el buscador deja solo "BLOQUE BUSTER".
- [ ] Elegir la categoría "PUZZLE" deja solo "CAÍDA".
- [ ] Una búsqueda sin resultados muestra "NO HAY RESULTADOS".
- [ ] Hacer clic en una tarjeta navega a `/juegos/[id]` correspondiente.
- [ ] `/juegos/no-existe` y `/jugar/no-existe` muestran la página de no encontrado.
- [ ] En `/jugar/[id]` el botón PAUSA muestra "EN PAUSA" y el botón REANUDAR lo quita.
- [ ] En `/jugar/[id]` la puntuación permanece en 0 durante 10 segundos sin interacción.
- [ ] En `/jugar/[id]` el botón FIN muestra "FIN DEL JUEGO" con puntuación 0 y no muestra campo de nombre ni botón de guardar.
- [ ] El botón SALIR en `/jugar/[id]` lleva a `/juegos/[id]`.
- [ ] En `/salon` cambiar de pestaña cambia el podio y la tabla.
- [ ] Sin sesión, `/salon` no muestra la fila "TU MEJOR MARCA".
- [ ] Con sesión, `/salon` muestra la fila "TU MEJOR MARCA" con el nombre de la sesión.
- [ ] En `/acceder` solo hay campos Usuario y Contraseña, sin pestaña de registro ni botones de Google o GitHub.
- [ ] Enviar `/acceder` con usuario "px_kai" guarda `av_user` como `{"name":"PX_KAI"}` y vuelve a `/`.
- [ ] Enviar `/acceder` sin usuario guarda el nombre "PLAYER1".
- [ ] Un nombre de más de 10 caracteres se guarda recortado a 10 en mayúsculas.
- [ ] JUGAR COMO INVITADO borra `av_user` y vuelve a `/`.
- [ ] Recargar la página con sesión iniciada mantiene el nombre en la barra.
- [ ] Si `localStorage` lanza excepción, la app funciona como invitado sin errores en consola.
- [ ] En 360 px de ancho ninguna de las cinco rutas tiene scroll horizontal.
- [ ] En 390 px el menú hamburguesa abre el panel y muestra los mismos enlaces que la plantilla.
- [ ] La consola del navegador no muestra errores de hidratación en ninguna de las cinco rutas.
- [ ] El texto de la interfaz está en español y coincide con la plantilla.

---

## Decisions taken and discarded

- **Yes: rutas reales de Next.js** (`/juegos/[id]`, `/jugar/[id]`, `/salon`, `/acceder`). Permiten enlaces, historial del navegador y pantallas separadas. Lo que se descarta: replicar el hash-routing de `app.jsx`, que pelea con el App Router.
- **Yes: datos en `app/data/mock-data.ts`, un solo archivo.** Se interpretó "un archivo app/data" como un único módulo con todos los datos ficticios. Si se prefiere una carpeta con un archivo por entidad, se cambia antes de implementar el paso 1.
- **Yes: datos TypeScript estáticos.** Lo que se descarta: JSON en `public/` leído con `fetch`, porque agrega una capa asíncrona sin valor visual.
- **Yes: sesión simulada en `localStorage` con clave `av_user`.** Es el único estado persistente del MVP y reproduce los estados "con usuario" de la plantilla. Lo que se descarta: estado solo en memoria (se pierde al recargar) y formulario sin efecto (pierde la barra con nombre).
- **Yes: la sesión se lee después del montaje (`useEffect`).** Evita errores de hidratación, porque el servidor no conoce `localStorage`. Costo: un parpadeo de invitado al cargar.
- **Yes: placeholder estático en el reproductor.** Sin contador animado, sin enemigos, sin guardado. Lo que se descarta: mantener la animación de la plantilla, porque simula un juego y genera puntuaciones falsas.
- **Yes: el modal FIN muestra puntuación 0 sin campo de nombre ni botón de guardar.** Consecuencia de la decisión anterior: no hay nada que guardar. Decisión tomada por el paso anterior, no confirmada por separado.
- **Yes: se omiten los enemigos del área CRT.** Son elementos de juego. Se conservan la cuadrícula y la nave.
- **Yes: se eliminan los botones de Google y GitHub y el separador "O CONTINÚA CON".** Confirmado en la ronda 2 (opción c).
- **Yes: sin pestaña "Crear cuenta".** Confirmado en la ronda 2 (opción b). El formulario tiene solo Usuario y Contraseña.
- **Yes: menú hamburguesa en móvil y todas las rutas sin scroll horizontal a 360 px.** Confirmado en la ronda 2 (opción a).
- **Yes: verificación con build, lint, tsc y comparación visual manual.** Confirmado en la ronda 2 (opción a). Lo que se descarta: agregar Vitest o Playwright en este MVP, que queda para una spec propia.
- **Yes: búsqueda y categoría en estado del cliente, sin query params.** Confirmado en la ronda 2 (opción a). Lo que se descarta: reflejarlas en la URL.
- **Yes: estilos ya portados en `app/globals.css`.** No se rehacen. Lo que se descarta: reescribir el CSS con Tailwind, porque la plantilla ya es fiel y las clases `av-*` son la referencia visual.
- **Yes: `not-found.tsx` agregado.** La plantilla devuelve `null` ante un id desconocido, lo que deja la pantalla en blanco. Es el único elemento visual que no existe en la plantilla.
- **Yes: `lang="es"` y título "Arcade Vault · Portal Retro".** El `layout.tsx` actual dice `lang="en"` y "Create Next App".
- **Yes: `/frontend-design` para los componentes sin referencia en la plantilla** (estados de error, `not-found.tsx`). `CLAUDE.md` exige usar esa skill para UI. Las pantallas existentes se rigen por la plantilla.
- **No: Vitest o Playwright en este MVP.** Queda para una spec propia.
- **No: guardado de puntuaciones (`av_scores`).** No hay juego que las genere.
- **No: registro de cuentas.** Confirmado en la ronda 2.
- **No: validación real de contraseña.** Es una sesión simulada.

---

## Identified risks

| Riesgo | Mitigación |
| --- | --- |
| Error de hidratación por leer `localStorage` durante el render del servidor. | La sesión se lee en `useEffect`. El primer render es de invitado. Revisar la consola en las cinco rutas. |
| `toLocaleString("es-ES")` puede dar resultados distintos entre servidor y cliente. | Los números se formatean con la misma función en ambos lados. No se usa `Date` ni valores aleatorios. |
| `localStorage` bloqueado (modo privado, datos del sitio borrados). | Todas las lecturas y escrituras van en `try/catch`. Sin sesión, la app funciona como invitado. |
| El efecto de inclinación de la tarjeta no aplica en pantallas táctiles. | Es un efecto visual. En táctil la tarjeta se ve igual y el clic funciona. |
| Los estilos portados se desvían de la plantilla con los cambios futuros. | Verificación visual en el paso 10 contra `Arcade Vault.html`. |
| `CLAUDE.md` dice que `layout.tsx` carga Geist, pero ya carga Press Start 2P, Courier Prime y JetBrains Mono. | Se sigue el código actual. Actualizar `CLAUDE.md` fuera de esta spec. |

---

## What is **not** in this spec

- Cualquier juego, motor de juego o simulación de partida.
- Guardado de puntuaciones y ranking real.
- Base de datos, API o backend.
- Inicio de sesión con Google o GitHub, registro de cuentas y validación de contraseña.
- Búsqueda reflejada en la URL.
- Tests automatizados.

Cada una, si entra, va en su propia spec.
