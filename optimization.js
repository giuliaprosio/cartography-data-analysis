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

    let orderedNodes = [];
    let bestAccuracy = 10000000;
    //RE-ORDER BASED OFF ACCURACY:
    for(let i=0; i<currentGraph.nodes.length; i++){
        if(currentGraph.nodes[i].acc < bestAccuracy){
            bestAccuracy = currentGraph.nodes[i].acc;
            orderedNodes.unshift(currentGraph.nodes[i]);
        }
        else{
            for(let j=0; j<idxToPosition.length; j++){
                if(orderedNodes[j].acc < currentGraph.nodes[i].acc) continue;
                else{
                    orderedNodes.splice(j, 0, currentGraph.nodes[i]);
                }
            }
        }
    }

    console.log("ordered for accuracy: ", orderedNodes);

    let idxToPosition = [];
    for(let i=0; i<currentGraph.nodes.length; i++){
        for(let j=0; j<orderedNodes.length; j++){
            if(currentGraph.nodes[i].ip === orderedNodes[j].ip) idxToPosition[i] = j;
        }
    }

    for(let edge in currentGraph.edges){
        for(let i=0; i<idxToPosition.length; i++){
            if(edge.src === i) edge.src = idxToPosition[i];
            if(edge.dest === i) edge.dest = idxToPosition[i];
        }
    }

    console.log("new ordered edges numbers", currentGraph);

    lastGraph = currentGraph;

    return currentGraph;

}