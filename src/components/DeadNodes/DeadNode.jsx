import { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import data from "../../data.json";

function getNodeId(endpoint) {
  return endpoint !== null && typeof endpoint === "object"
    ? endpoint.id
    : endpoint;
}

export function markDeadNodes({ nodes, links }) {
  const connectedIds = links.reduce((ids, { source, target }) => {
    ids.add(getNodeId(source));
    ids.add(getNodeId(target));
    return ids;
  }, new Set());

  return {
    nodes: nodes.map((node) => ({
      ...node,
      color: connectedIds.has(node.id) ? "#4f86c6" : "#c4c4c4",
    })),
    links: links.map((link) => ({
      ...link,
      source: getNodeId(link.source),
      target: getNodeId(link.target),
    })),
  };
}

export default function MainPage() {
  const graphData = useMemo(() => markDeadNodes(data), []);

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeId="id"
      nodeLabel="name"
      nodeVal="val"
      nodeColor="color"
    />
  );
}