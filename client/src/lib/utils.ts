export const capitalize = (x: string) => x[0].toUpperCase() + x.slice(1);
const collator = new Intl.Collator("en");

export function insertAlphabetically<T extends { name: string }>(
  items: T[],
  item: T,
) {
  // const index = items.findIndex(
  //   (existing) =>
  //     existing.name.localeCompare(item.name, "en", {
  //       sensitivity: "base",
  //     }) > 0,
  // );
  // const index = items.findIndex((existing) => existing.name > item.name);
  // const index = items.findIndex(
  //   (existing) => existing.name.localeCompare(item.name) > 0,
  // );
  const index = items.findIndex(
    (existing) => collator.compare(existing.name, item.name) > 0,
  );

  if (index === -1) {
    return [...items, item];
  }

  return [...items.slice(0, index), item, ...items.slice(index)];
}
