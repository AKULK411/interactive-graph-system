import { useEffect, useRef } from "react"
import ForceGraph3D from "react-force-graph-3d"
import {changeColor, configureChargeForce, dataSet, nodelabel} from '../GraphLogic'

export default function Graph3D(){
    const graphRef = useRef(null);

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