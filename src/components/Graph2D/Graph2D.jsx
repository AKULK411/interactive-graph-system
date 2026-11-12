import { useEffect, useRef } from "react"
import ForceGraph2D from "react-force-graph-2d"
import {changeColor, configureChargeForce, dataSet, nodelabel} from '../GraphLogic'

export default function Graph2D(value){
    const graphRef = useRef(null);

    useEffect(() => {
        configureChargeForce(graphRef.current);
    }, []);

    return(<>
    
    <ForceGraph2D
    ref={graphRef}
    cooldownTicks={300}
    backgroundColor="#f1f1f0"

    nodeColor={changeColor}
    linkDirectionalParticles={value.value}
    nodeLabel={nodelabel}
    graphData={dataSet}
    width={1112} height={886}

    />
    </>)
}