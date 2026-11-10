    const KEY = "app:json-data";
    const data = sessionStorage.getItem(KEY)
        ? JSON.parse(sessionStorage.getItem(KEY))
        : { nodes: [], links: [] };

    const targetCount = data.links.reduce((result, targets)=>{
    const target = targets.target;
    result[target]=(result[target] || 0)+1;
    return result
    },{})

    const sourceCount = data.links.reduce((result, source)=>{
    const sourses = source.source;
    result[sourses]=(result[sourses] || 0)+1;
    return result
    },{})

    export function changeColor(node){
    const targetCheck = targetCount[node.id] ?? 0;
    const sourceCheck = sourceCount[node.id] ?? 0;
    if((targetCheck!=0 && sourceCheck!=0)){
        return('red')
    } 
    else if(targetCheck>=1 || sourceCheck>=1){
        return('#ffac4d')
    } 
    else if((targetCheck===0 && sourceCheck===0)){
        return('grey')
    } }

    export const dataSet = {
    nodes:data.nodes.map((node)=>({id:node.id, name:node.name, val:(targetCount[node.id]??0)+(sourceCount[node.id]??0)})),
    links:data.links.map((link)=>({source:link.source,target:link.target})),
    }

    export function configureChargeForce(graph) {
    const chargeForce = graph?.d3Force("charge");
    if (!chargeForce) return;

    chargeForce.strength((node) => (node.val === 0 ? -5 : -30));
    graph.d3ReheatSimulation();
    }

    export const nodelabel = (node) => `${node.name}: ${sourceCount[node.id]??0} исходящих связей ${targetCount[node.id]??0} входящих связей`
