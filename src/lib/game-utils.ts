/**
 * Typed helper for accessing NarraLeaf Storable namespaces.
 * The Namespace type is not exported from narraleaf-react, so we
 * define the minimal interface we need here.
 */

export interface GameNamespace {
  set(key: string, value: number | string): void;
  get(key: string): number | string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStorable = { getNamespace(key: string): any };

export function getGameNamespace(storable: AnyStorable): GameNamespace {
  return storable.getNamespace("game") as GameNamespace;
}

export function addScore(storable: AnyStorable, delta: number): void {
  const ns = getGameNamespace(storable);
  const current = typeof ns.get("score") === "number" ? (ns.get("score") as number) : 0;
  ns.set("score", current + delta);
}

export function setEnding(storable: AnyStorable, ending: string): void {
  getGameNamespace(storable).set("ending", ending);
}
