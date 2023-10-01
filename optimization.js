import { last } from "lodash";

let lastGraph = {
    "nodes": [],
    "edges": []
};

export function optimizeGraph(currentGraph){

    if(currentGraph.nodes.length === 0) return currentGraph;

    if(lastGraph.nodes.length === 0){
        lastGraph = currentGraph;
        console.log("last graph: ", lastGraph);
        return currentGraph;
    }

    for(let node in currentGraph.nodes){
        for(let corresponder in lastGraph.nodes){
            if(node.ip === corresponder.ip){
                //COMPARE -- lets understand this part
                //console.log("found a match");
            }

        }
    }

    let idxToPosition = [];
    let bestAccuracy = 10000000;
    //RE-ORDER BASED OFF ACCURACY:
    for(let i=0; i<currentGraph.nodes.length; i++){
        if(currentGraph.nodes[i].acc < bestAccuracy){
            bestAccuracy = currentGraph.nodes[i].acc;
            idxToPosition.unshift(currentGraph.nodes[i]);
        }
        else{
            for(let j=0; j<idxToPosition.length; j++){
                if(idxToPosition[j].acc < currentGraph.nodes[i].acc) continue;
                else{
                    idxToPosition.splice(j, 0, currentGraph.nodes[i]);
                }
            }
        }
    }

    console.log("ordered for accuracy: ", idxToPosition);

    lastGraph = currentGraph;

    return currentGraph;

}