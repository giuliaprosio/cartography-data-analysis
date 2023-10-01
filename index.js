import _ from 'lodash';
import * as backend from "./backend";
import * as ll from "./leafletLayers";
import * as loc from "./localize";
import {splitWords} from "leaflet/src/core/Util";
import graphml from "graphml-js";
import * as opt from "./optimization";

let LATITUDE = 0.0;
let LONGITUDE = 0.0;
let ACCURACY = 0.0;
let TIMESTAMP = 0;

let listGraph = [];


window.onload = async () => {

    let map, layerGraph = ll.init();
    window.map = map;
    window.layer = layerGraph;

    parseGraph();
    setInterval(parseGraph, 20000); //20 seconds for each iteration
    window.parseGraph = parseGraph;

    async function parseGraph() {


        let currentGraph = await backend.getCurrentJson();

        //console.log("current graph: ", currentGraph);

        let currentOptimizedGraph = await opt.optimizeGraph(currentGraph);
   
        //initialization to redo
        layerGraph.clearLayers();
        document.getElementById("routerList").innerHTML = "";



        /**NODES */
        //let [absGraph, dropRouter] = loc.logicLocalization(gpsLastSeen, graph);
        //console.log("to drop: ", dropRouter);

        listGraph.push(Object.assign({}, currentGraph)); //absGraph
        //console.log("listgraph ", listGraph);

        localStorage.setItem('list', JSON.stringify(listGraph));
        let absGraph = currentGraph;


        //--------------------------

        for (let k = 0; k < absGraph.nodes.length; k++) {
            let absNode = absGraph.nodes[k];
            let absNodeIP = absNode.ip;
            let absNodeName = absNode.name;

            let popupContent = 'Name: ' + absNodeName + '<br>' + 'ip: ' + absNodeIP + '<br>';

            let absNodeType = absNode.type;
            if (absNodeType === 'user') {
                //find associated router
                popupContent += '<br>' + "Associated router: " + absNode.associatedRouterName + '<br>' + "Router ip: " + absNode.associateRouterIP;

                let c = ll.drawCircle(absNode.lat, absNode.lng, "red", 1.5, 1, 2);  //red
                let cAcc = ll.drawCircle(absNode.lat, absNode.lng, "red", absNode.acc, 0.35, 0);

                c.bindPopup(popupContent).openPopup();
                c.addTo(layerGraph);
                cAcc.bindPopup(popupContent).openPopup();
                cAcc.addTo(layerGraph);

                continue;
            }

            let r = ll.drawCircle(absNode.lat, absNode.lng, "blue", 1.5, 1, 2);  //blue
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
            let absNode = currentOptimizedGraph.nodes[k];
            let absNodeIP = absNode.ip;
            let absNodeName = absNode.name;

            let popupContent = 'Name: ' + absNodeName + '<br>' + 'ip: ' + absNodeIP + '<br>';

            let absNodeType = absNode.type;
            if (absNodeType === 'user') {
                //find associated router
                popupContent += '<br>' + "Associated router: " + absNode.associatedRouterName + '<br>' + "Router ip: " + absNode.associateRouterIP;

                let c = ll.drawCircle(absNode.lat, absNode.lng, "blue", 1.5, 1, 2);  //red
                let cAcc = ll.drawCircle(absNode.lat, absNode.lng, "blue", absNode.acc, 0.35, 0);

                c.bindPopup(popupContent).openPopup();
                c.addTo(layerGraph);
                cAcc.bindPopup(popupContent).openPopup();
                cAcc.addTo(layerGraph);

                continue;
            }

            let r = ll.drawCircle(absNode.lat, absNode.lng, "blue", 1.5, 1, 2);  //blue
            let rAcc = ll.drawCircle(absNode.lat, absNode.lng, "blue", absNode.acc, 0.5, 0);

            r.bindPopup(popupContent).openPopup();
            r.addTo(layerGraph);
            rAcc.bindPopup(popupContent).openPopup();
            rAcc.addTo(layerGraph);

        }

        /**EDGES */

        let alreadySeen2 = {};

        for (let l = 0; l < currentOptimizedGraph.edges.length; l++) {

            let edge = currentOptimizedGraph.edges[l];

            let source = edge.source;
            let dest = edge.dest;

            let key;
            if (source < dest) {
                key = source + "-" + dest;
            } else {
                key = dest + "-" + source;
            }

            let otherEdge = alreadySeen2[key];
            if (otherEdge === undefined) {
                alreadySeen2[key] = edge;
                continue;
            }

            //if(edge.rssi > -100 && otherEdge.rssi > -100){
            //console.log("edge to draw: ", edge);
            let edgeSrcLat = currentOptimizedGraph.nodes[edge.source].lat;
            let edgeSrcLng = currentOptimizedGraph.nodes[edge.source].lng;
            let edgeDestLat = currentOptimizedGraph.nodes[edge.dest].lat;
            let edgeDestLng = currentOptimizedGraph.nodes[edge.dest].lng;
            let polyl = ll.drawEdge(edgeSrcLat, edgeSrcLng, edgeDestLat, edgeDestLng);

            if (otherEdge) {
                let signal = 'Signal 1: ' + edge.rssi + '<br>' + 'Signal 2: ' + otherEdge.rssi + '<br>';
                polyl.bindPopup(signal).openPopup();
            }

            polyl.addTo(layerGraph);
            //}

           
            delete alreadySeen2[key];



        }

    }



}








