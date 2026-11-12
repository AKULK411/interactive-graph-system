function endpointId(endpoint) {
  return endpoint !== null && typeof endpoint === "object" ? endpoint.id : endpoint;
}

export function createGraphData(graph) {
  const sourceCount = new Map();
  const targetCount = new Map();

  for (const link of graph.links) {
    const source = endpointId(link.source);
    const target = endpointId(link.target);
    sourceCount.set(source, (sourceCount.get(source) ?? 0) + 1);
    targetCount.set(target, (targetCount.get(target) ?? 0) + 1);
  }

  return {
    nodes: graph.nodes.map((node) => {
      const outgoing = sourceCount.get(node.id) ?? 0;
      const incoming = targetCount.get(node.id) ?? 0;
      return { ...node, val: outgoing + incoming, outgoing, incoming };
    }),
    links: graph.links.map((link) => ({ ...link })),
  };
}

export function changeColor(node) {
  if (node.incoming > 0 && node.outgoing > 0) return "red";
  if (node.incoming > 0 || node.outgoing > 0) return "#ffac4d";
  return "grey";
}

export function configureChargeForce(graph) {
  const chargeForce = graph?.d3Force("charge");
  if (!chargeForce) return;

  chargeForce.strength((node) => (node.val === 0 ? -5 : -30));
  graph.d3ReheatSimulation();
}

export const nodelabel = (node) =>
  `${node.name}: ${node.outgoing} исходящих связей ${node.incoming} входящих связей`;
