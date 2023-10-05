let map;
let layerGraph;

import L from "leaflet";

export function init(){
    map = L.map("map").setView([48.846696, 2.354834], 19);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 32
    }).addTo(map);

    layerGraph = L.layerGroup().addTo(map);

    return map, layerGraph;

}

export function drawCircle(lat, lng, color, radius, opacity, weight){
    
    let c = L.circle([lat, lng], {
        color: 'black',
        fillColor: color,
        fillOpacity: opacity,
        radius: radius,
        weight: weight
    });

    return c;
   
}

export function drawEdge(edgeSourceLat, edgeSourceLng, edgeDestLat, edgeDestLng){
    var pointA = new L.LatLng(edgeSourceLat, edgeSourceLng);
    var pointB = new L.LatLng(edgeDestLat, edgeDestLng);

    var polyl = new L.Polyline([pointA, pointB], {
        color: 'black',
        weight: 2,
        opacity: 1,
        smoothFactor: 0.5
    });

    return polyl;

}