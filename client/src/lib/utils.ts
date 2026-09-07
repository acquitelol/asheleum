export const capitalize = (x: string) => x[0].toUpperCase() + x.slice(1);

export function insertAlphabetically<T extends { name: string }>(
  items: T[],
  item: T,
) {
  const index = items.findIndex(
    (existing) => existing.name.localeCompare(item.name) > 0,
  );

  if (index === -1) {
    return [...items, item];
  }

  return [...items.slice(0, index), item, ...items.slice(index)];
}
