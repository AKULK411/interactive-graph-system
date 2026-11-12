import { useEffect, useMemo, useRef } from "react"
import ForceGraph3D from "react-force-graph-3d"
import { changeColor, configureChargeForce, createGraphData, nodelabel } from "../GraphLogic"

export default function Graph3D({ graph }) {
    const graphRef = useRef(null);
    const dataSet = useMemo(() => createGraphData(graph), [graph]);

    useEffect(() => {
        configureChargeForce(graphRef.current);
    }, []);

    return(<>
    <ForceGraph3D
    ref={graphRef}
    cooldownTicks={60}
    nodeResolution={6}
    backgroundColor="#f1f1f0"
    linkColor={() => "#131a29"}
    nodeColor={changeColor}
    nodeLabel={nodelabel}
    graphData={dataSet}
    width={1112} height={886}/>
    </>)
}