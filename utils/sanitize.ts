// utils/sanitize.ts
export function sanitize<T extends { id?: string | number }>(arr: any): T[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter((x) => x && (x.id !== undefined && x.id !== null));
}
