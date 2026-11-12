import { useEffect, useRef } from "react"
import ForceGraph2D from "react-force-graph-2d"
import { changeColor, configureChargeForce, createGraphData, nodelabel } from "../GraphLogic"

export default function Graph2D({ graph, value, showArrows = false }) {
    const graphRef = useRef(null);
    const dataSet = createGraphData(graph);

    useEffect(() => {
        configureChargeForce(graphRef.current);
    }, []);

    return(<>
    
    <ForceGraph2D
    ref={graphRef}
    cooldownTicks={300}
    backgroundColor="#f1f1f0"

    linkDirectionalArrowLength={showArrows ? 5 : 0}
    linkDirectionalArrowRelPos={0.95}
    linkDirectionalParticles={value}

    nodeColor={changeColor}
    nodeLabel={nodelabel}
    graphData={dataSet}
    onNodeClick={(node) => graph.onNodeSelect?.(node.id)}
    width={1112} height={886}

    />
    </>)
}