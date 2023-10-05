import { last } from "lodash";
import * as rssiConverter from "./rssi-to-d";
import * as distanceCalc from "./coord-to-d";
import * as newCoord from "./new-coord";

let lastGraph = {
    "nodes": [],
    "edges": []
};

export async function optimizeGraph2(currentGraph){
    let newGraph = structuredClone(currentGraph);

    if(currentGraph.nodes.length == 0) return newGraph;

    if(lastGraph.nodes.length == 0){
        lastGraph = currentGraph;
        //console.log("last graph: ", lastGraph);
        return newGraph;
    }

    for(let node of newGraph.nodes){
        for(let corresponder of lastGraph.nodes){
            if(node.ip === corresponder.ip){
                //COMPARE -- lets understand this part
                //console.log("found a match");
            }

        }
    }

    let orderedNodes = [];
    let bestAccuracy = 10000000;
    //RE-ORDER BASED OFF ACCURACY:
    for(let i=0; i<newGraph.nodes.length; i++){
        if(newGraph.nodes[i].acc < bestAccuracy){
            bestAccuracy = newGraph.nodes[i].acc;
            orderedNodes.unshift(newGraph.nodes[i]);
            //console.log("best accuracy: ", bestAccuracy);
        }
        else{
            for(let j=0; j<orderedNodes.length; j++){
                //console.log("one example: ", orderedNodes[j].acc);
                if(orderedNodes[j].acc < newGraph.nodes[i].acc) continue;
                else{
                    orderedNodes.splice(j, 0, newGraph.nodes[i]);
                }
            }
        }
    }

    //console.log("ordered for accuracy: ", orderedNodes);

    let idxToPosition = [];
    for(let i=0; i<newGraph.nodes.length; i++){
        for(let j=0; j<orderedNodes.length; j++){
            if(newGraph.nodes[i].ip === orderedNodes[j].ip) idxToPosition[i] = j;
        }
    }

    for(let edge of newGraph.edges){
        for(let i=0; i<idxToPosition.length; i++){
            if(edge.src === i) edge.src = idxToPosition[i];
            if(edge.dest === i) edge.dest = idxToPosition[i];
        }
    }

    //console.log("new ordered edges numbers", currentGraph.edges);


    //FIXED POINT:
    let fixedNode = orderedNodes[0];
    for(let k=1; k<orderedNodes.length; k++){
        for(let edge of newGraph.edges){
            
            if((edge.source == 0 && edge.dest == k)){
                let rssi = edge.rssi;
                let rssiDist = rssiConverter.rssiConversion(rssi);
                let distCoord = distanceCalc.coordToDistance(fixedNode.lat, fixedNode.lng, orderedNodes[k].lat, orderedNodes[k].lng);

                //console.log("old lat, lng: ", orderedNodes[k].lat, orderedNodes[k].lng);
                let newLat, newLng;
                [newLat, newLng] = newCoord.newCoords(fixedNode.lat, fixedNode.lng, orderedNodes[k].lat, orderedNodes[k].lng, rssiDist, distCoord);

                orderedNodes[k].lat = newLat;
                orderedNodes[k].lng = newLng;
                //console.log("new lat, lng: ", newLat, newLng);

            }else if(edge.source == k && edge.dest == 0){
                let rssi = edge.rssi;
                let rssiDist = rssiConverter.rssiConversion(rssi);
                let distCoord = distanceCalc.coordToDistance(fixedNode.lat, fixedNode.lng, orderedNodes[k].lat, orderedNodes[k].lng);

                //console.log("old lat, lng: ", orderedNodes[k].lat, orderedNodes[k].lng);
                let newLat, newLng;
                [newLat, newLng] = newCoord.newCoords(fixedNode.lat, fixedNode.lng, orderedNodes[k].lat, orderedNodes[k].lng, rssiDist, distCoord);

                orderedNodes[k].lat = newLat;
                orderedNodes[k].lng = newLng;
                //console.log("new lat, lng: ", newLat, newLng);

            }
            
        }
    }

    lastGraph = newGraph;
    newGraph.nodes = orderedNodes; 

    //console.log("final graph: ",newGraph);

    return newGraph;

}

export function optimizeGraph3(currentGraph){
    let newnewGraph = structuredClone(currentGraph);

    for(let node of newnewGraph.nodes){

        node.lat = node.lat + 0.0005;
   
       
    }

    return newnewGraph;

}
