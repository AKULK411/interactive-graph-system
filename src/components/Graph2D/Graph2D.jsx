import { useMemo } from "react"
import ForceGraph2D from "react-force-graph-2d"
import data from '../../data/data.json'

export default function Graph2D(){

    const targetCount = useMemo(()=> 
    data.links.reduce((result, targets)=>{
    const target = targets.target;
    result[target]=(result[target] || 0)+1;
    return result
    },{}))
    
    const sourceCount = useMemo(()=> 
    data.links.reduce((result, source)=>{
    const sourses = source.source;
    result[sourses]=(result[sourses] || 0)+1;
    return result
    },{})) 

    const dataSet = useMemo(()=>({
    nodes:data.nodes.map((node)=>({id:node.id, name:node.name, val:(targetCount[node.id]??0)+(sourceCount[node.id]??0)})),
    links:data.links.map((link)=>({source:link.source,target:link.target})),
    }))

    return(<>
    <ForceGraph2D linkDirectionalParticles={2} nodeLabel={(node) => `${node.name}: ${node.val} входящих и исходящих связей`} graphData={dataSet} width={800} height={800}/>
    </>)
}