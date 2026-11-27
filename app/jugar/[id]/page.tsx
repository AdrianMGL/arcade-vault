import { notFound } from "next/navigation";
import { GAMES, getGame } from "@/app/data/mock-data";
import { GamePlaceholder } from "@/app/components/game-placeholder";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  return <GamePlaceholder game={game} />;
}
