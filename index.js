import _ from 'lodash';
import * as backend from "./backend";
import * as ll from "./leafletLayers";
import * as loc from "./localize";
import {splitWords} from "leaflet/src/core/Util";
import graphml from "graphml-js";
import * as opt from "./optimization";



function optimizeGraph(graph){
    let newnewGraph = {
        "nodes": [],
        "edges": []
    };

    for(let node of graph.nodes){
       for(let otherNode of newnewGraph.nodes){
        otherNode.name = node.name;
        otherNode.ip = node.ip;
        otherNode.lat = node.lat + 0.0005;
        otherNode.lng = node.lng;
        otherNode.acc = node.acc;
        otherNode.ts = node.ts;
        otherNode.type = node.type;
        otherNode.associatedRouterName = node.associatedRouterName;
        otherNode.associatedRouterIP = node.associatedRouterIP;
      
       }
    }

    return newnewGraph;

}

async function runSequentially(){
    
     //let absGraph = await backend.getCurrentJson();
     //let currentOptimizedGraph = optimizeGraph(absGraph);
     //setTimeout(1000);
     //currentOptimizedGraph = await opt.optimizeGraph(absGraph);

     //return (absGraph, currentOptimizedGraph);
} 


window.onload = async () => {

    let map, layerGraph = ll.init();
    window.map = map;
    window.layer = layerGraph;


    parseGraph();
    setInterval(parseGraph, 3000); //20 seconds for each iteration
    window.parseGraph = parseGraph;

    async function parseGraph() {

        /*await backend.getCurrentJson().then(
            data => {
                absGraph = data;
                console.log("ooooold: ",absGraph);
                currentOptimizedGraph = optimizeGraph4(absGraph);
            }
        ) */

        /*await runSequentially();
        console.log("before");
        let vartmp = 1000;
        while(vartmp>0){
            vartmp --;
        }
        console.log("after"); */
        let absGraph = await backend.getCurrentJson()
            

        //tmp = absGraph;
        //console.log("current graph: ", currentGraph);

        //console.log("current graph: ", currentGraph);

        let currentOptimizedGraph = await opt.optimizeGraph3(absGraph);
        //console.log("current optimized graph: ", currentOptimizedGraph);
   
        //initialization to redo
        layerGraph.clearLayers();
        document.getElementById("routerList").innerHTML = "";



        /**NODES */
        //let [absGraph, dropRouter] = loc.logicLocalization(gpsLastSeen, graph);
        //console.log("to drop: ", dropRouter);

        //listGraph.push(Object.assign({}, currentGraph)); //absGraph
        //console.log("listgraph ", listGraph);

        //localStorage.setItem('list', JSON.stringify(listGraph));
        console.log("absGraph: ", absGraph);
        console.log("optimized graph: ", currentOptimizedGraph);

        //--------------------------

        for (let k = 0; k < absGraph.nodes.length; k++) {
            let absNode = absGraph.nodes[k];
            let absNodeIP = absNode.ip;
            let absNodeName = absNode.name;

            //let popupContent = 'Name: ' + absNodeName + '<br>' + 'ip: ' + absNodeIP + '<br>';

            let absNodeType = absNode.type;
            if (absNodeType === 'user') {
                //find associated router
                //popupContent += '<br>' + "Associated router: " + absNode.associatedRouterName + '<br>' + "Router ip: " + absNode.associateRouterIP;

                let c = ll.drawCircle(absNode.lat, absNode.lng, "red", 0.8, 1, 2);  //red
                let cAcc = ll.drawCircle(absNode.lat, absNode.lng, "red", absNode.acc, 0.25, 0);

                //c.bindPopup(popupContent).openPopup();
                c.addTo(layerGraph);
               
                //cAcc.bindPopup(popupContent).openPopup();
                cAcc.addTo(layerGraph);

                continue;
            }

            let r = ll.drawCircle(absNode.lat, absNode.lng, "blue", 2, 1, 2);  //blue
            let rAcc = ll.drawCircle(absNode.lat, absNode.lng, "blue", absNode.acc, 0.5, 0);

            r.bindPopup(popupContent).openPopup();
            r.addTo(layerGraph);
            rAcc.bindPopup(popupContent).openPopup();
            rAcc.addTo(layerGraph);

        }

        /**EDGES */

        let alreadySeen = {};

        for (let l = 0; l < absGraph.edges.length; l++) {

            let edge = absGraph.edges[l];

            let source = edge.source;
            let dest = edge.dest;

            let key;
            if (source < dest) {
                key = source + "-" + dest;
            } else {
                key = dest + "-" + source;
            }

            let otherEdge = alreadySeen[key];
            if (otherEdge === undefined) {
                alreadySeen[key] = edge;
                continue;
            }

            //if(edge.rssi > -100 && otherEdge.rssi > -100){
            //console.log("edge to draw: ", edge);
            let polyl = ll.drawEdge(edge.sourceLat, edge.sourceLng, edge.destLat, edge.destLng);

            if (otherEdge) {
                let signal = 'Signal 1: ' + edge.rssi + '<br>' + 'Signal 2: ' + otherEdge.rssi + '<br>';
                polyl.bindPopup(signal).openPopup();
            }

            polyl.addTo(layerGraph);
            //}

           
            delete alreadySeen[key];


 
        } 

        //---------------------------------for optimized graph
        for (let k = 0; k < currentOptimizedGraph.nodes.length; k++) {
            let absNode2 = currentOptimizedGraph.nodes[k];
            let absNodeIP2 = absNode2.ip;
            let absNodeName2 = absNode2.name;

            let popupContent2 = 'Name: ' + absNodeName2 + '<br>' + 'ip: ' + absNodeIP2 + '<br>';

            let absNodeType2 = absNode2.type;
            if (absNodeType2 === 'user') {
                //find associated router
                popupContent2 += '<br>' + "Associated router: " + absNode2.associatedRouterName + '<br>' + "Router ip: " + absNode2.associateRouterIP;

                let c2 = ll.drawCircle(absNode2.lat, absNode2.lng, "blue", 0.5, 1, 2);  //red
                let cAcc2 = ll.drawCircle(absNode2.lat, absNode2.lng, "blue", absNode2.acc, 0.35, 0);

                c2.bindPopup(popupContent2).openPopup();
                c2.addTo(layerGraph);
                cAcc2.bindPopup(popupContent2).openPopup();
                cAcc2.addTo(layerGraph);

                continue;
            }

            let r2 = ll.drawCircle(absNode2.lat, absNode2.lng, "blue", 1.5, 1, 2);  //blue
            let rAcc2 = ll.drawCircle(absNode2.lat, absNode2.lng, "blue", absNode2.acc, 0.5, 0);

            r2.bindPopup(popupContent2).openPopup();
            r2.addTo(layerGraph);
            rAcc2.bindPopup(popupContent2).openPopup();
            rAcc2.addTo(layerGraph);

        }

        /**EDGES */

        let alreadySeen2 = {};

        for (let l = 0; l < currentOptimizedGraph.edges.length; l++) {

            let edge2 = currentOptimizedGraph.edges[l];

            let source2 = edge2.source;
            let dest2 = edge2.dest;

            let key2;
            if (source2 < dest2) {
                key2 = source2 + "-" + dest2;
            } else {
                key2 = dest2 + "-" + source2;
            }

            let otherEdge2 = alreadySeen2[key2];
            if (otherEdge2 == undefined) {
                alreadySeen2[key2] = edge2;
                continue;
            }

            //if(edge.rssi > -100 && otherEdge.rssi > -100){
            //console.log("edge to draw: ", edge);
            //console.log("searched node: ", currentOptimizedGraph.nodes[source2].lat);
            let edgeSrcLat = currentOptimizedGraph.nodes[source2].lat;
            let edgeSrcLng = currentOptimizedGraph.nodes[edge2.source].lng;
            let edgeDestLat = currentOptimizedGraph.nodes[edge2.dest].lat;
            let edgeDestLng = currentOptimizedGraph.nodes[edge2.dest].lng;
            let polyl2 = ll.drawEdge(edgeSrcLat, edgeSrcLng, edgeDestLat, edgeDestLng);

            if (otherEdge2) {
                let signal2 = 'Signal 1: ' + edge2.rssi + '<br>' + 'Signal 2: ' + otherEdge2.rssi + '<br>';
                polyl2.bindPopup(signal2).openPopup();
            }

            polyl2.addTo(layerGraph);
            //}

           
            delete alreadySeen2[key2];



        } 

    }



}










