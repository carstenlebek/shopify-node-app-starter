export const relayPaginationMerge = (
  existing,
  incoming,
  { readField, mergeObjects }
) => {
  const merged = existing ? existing.edges.slice(0) : [];
  const itemIdToIndex = Object.create(null);
  if (existing) {
    existing.edges.forEach((item, index) => {
      itemIdToIndex[readField("cursor", item)] = index;
    });
  }
  incoming.edges.forEach((item) => {
    const cursor = readField("cursor", item);
    const index = itemIdToIndex[cursor];
    if (typeof index === "number") {
      // Merge the new item data with the existing item data.
      merged[index] = mergeObjects(merged[index], item);
    } else {
      // First time we've seen this item in this array.
      itemIdToIndex[cursor] = merged.length;
      merged.push(item);
    }
  });
  const obj = {
    ...existing,
    ...incoming,
    edges: [...merged],
  };
  return obj;
};
