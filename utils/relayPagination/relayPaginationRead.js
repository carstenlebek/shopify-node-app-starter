export const relayPaginationRead = (
  existing,
  { args: { first, after, last, before } }
) => {
  if (!existing) return undefined;

  if (first) {
    let arr = [...existing.edges].splice(
      after ? existing.edges.findIndex((edge) => edge.cursor === after) + 1 : 0,
      first
    );
    return {
      pageInfo: {
        hasNextPage:
          existing.edges.findIndex((edge) => edge.cursor === after) + first <
          existing.edges.length,
        hasPreviousPage:
          existing.edges.findIndex((edge) => edge.cursor === after) > 0,
      },
      edges: arr,
    };
  }
  if (last) {
    let arr = [...existing.edges].splice(
      existing.edges.findIndex((edge) => edge.cursor === before) - last,
      last
    );
    return {
      pageInfo: {
        hasNextPage:
          existing.edges.findIndex((edge) => edge.cursor === before) - last <
          existing.edges.length,
        hasPreviousPage:
          existing.edges.findIndex((edge) => edge.cursor === before) - last > 0,
      },
      edges: arr,
    };
  }

  return existing;
};
