/**
 * Функции работы с графом { nodes: [...], links: [...] }.
 * Они не изменяют исходный граф и не обращаются к React, DOM, файлам или серверу.
 */
function assertGraph(graph) {
  if (!graph || typeof graph !== "object" || Array.isArray(graph) ||
      !Array.isArray(graph.nodes) || !Array.isArray(graph.links)) {
    throw new TypeError("Граф должен содержать массивы nodes и links.");
  }
}

function assertObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${name} должен быть объектом.`);
  }
}

function getEndpointId(endpoint) {
  return endpoint !== null && typeof endpoint === "object" ? endpoint.id : endpoint;
}

function createId() {
  if (typeof globalThis.crypto?.randomUUID !== "function") {
    throw new Error("Не удалось создать ID. Используйте HTTPS/localhost или передайте id явно.");
  }
  return `manual-${globalThis.crypto.randomUUID()}`;
}

export function addNode(graph, { name, targetId = null, id, nodeData = {}, linkData = {} } = {}) {
  assertGraph(graph);
  assertObject(nodeData, "nodeData");
  assertObject(linkData, "linkData");
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Введите имя нового узла.");
  }

  const newId = id === undefined ? createId() : id;
  if (typeof newId !== "string" || !newId.trim()) {
    throw new Error("ID нового узла должен быть непустой строкой.");
  }
  if (graph.nodes.some(node => node.id === newId)) {
    throw new Error(`Узел с ID «${newId}» уже существует.`);
  }

  const hasTarget = targetId !== null && targetId !== "";
  if (hasTarget && (typeof targetId !== "string" || !graph.nodes.some(node => node.id === targetId))) {
    throw new Error("Узел для подключения не найден.");
  }

  const addedNode = { ...nodeData, id: newId, name: name.trim() };
  let createdLink = null;
  if (hasTarget) {
    const linkId = linkData.id ?? `manual:${newId}:${targetId}`;
    if (typeof linkId !== "string" || !linkId.trim()) {
      throw new Error("ID новой связи должен быть непустой строкой.");
    }
    if (graph.links.some(link => link.id === linkId)) {
      throw new Error(`Связь с ID «${linkId}» уже существует.`);
    }
    createdLink = { ...linkData, id: linkId, source: newId, target: targetId };
  }

  return {
    graph: {
      ...graph,
      nodes: [...graph.nodes, addedNode],
      links: createdLink ? [...graph.links, createdLink] : [...graph.links],
    },
    addedNode,
    createdLink,
  };
}

export function deleteNode(graph, id) {
  assertGraph(graph);
  const deletedNode = graph.nodes.find(node => node.id === id);
  if (!deletedNode) throw new Error(`Узел с ID «${id}» не найден.`);

  const remainingLinks = [];
  const removedLinks = [];
  for (const link of graph.links) {
    if (getEndpointId(link.source) === id || getEndpointId(link.target) === id) {
      removedLinks.push(link);
    } else {
      remainingLinks.push(link);
    }
  }

  return {
    graph: {
      ...graph,
      nodes: graph.nodes.filter(node => node.id !== id),
      links: remainingLinks,
    },
    deletedNode,
    removedLinks,
  };
}

export function getNodeInfo(graph, id) {
  assertGraph(graph);
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  const node = nodesById.get(id);
  if (!node) throw new Error(`Узел с ID «${id}» не найден.`);

  const neighborIds = new Set();
  for (const link of graph.links) {
    const source = getEndpointId(link.source);
    const target = getEndpointId(link.target);
    if (source === id && target !== id && nodesById.has(target)) neighborIds.add(target);
    if (target === id && source !== id && nodesById.has(source)) neighborIds.add(source);
  }
  const connectedNodes = [...neighborIds].map(neighborId => {
    const neighbor = nodesById.get(neighborId);
    return { id: neighbor.id, name: neighbor.name };
  });

  return { id: node.id, name: node.name, node, connectedNodes, count: connectedNodes.length };
}
