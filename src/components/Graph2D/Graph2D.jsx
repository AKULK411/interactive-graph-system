import { memo, useCallback, useEffect, useMemo, useRef } from "react"
import ForceGraph2D from "react-force-graph-2d"
import { changeColor, configureChargeForce, createGraphData, nodelabel } from "../GraphLogic"

const Graph2D = memo(function Graph2D({ graph, value, showArrows = false, onNodeSelect }) {
    const graphRef = useRef(null);
    const dataSet = useMemo(() => createGraphData(graph), [graph]);
    const handleNodeClick = useCallback((node) => {
        onNodeSelect?.(node.id);
    }, [onNodeSelect]);

    useEffect(() => {
        configureChargeForce(graphRef.current);
    }, []);

    return (
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
            onNodeClick={handleNodeClick}
            width={1112}
            height={886}
        />
    );
});

export default Graph2D;