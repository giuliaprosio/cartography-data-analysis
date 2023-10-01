import graphml from "graphml-js";

/*export async function getGPSLastSeen() {
   
    let gpsLastSeenJSON = await fetch("./gpsPompier.json", {
        method: "GET",
    });

    let gpsLastSeen = JSON.parse(await gpsLastSeenJSON.text());

    return gpsLastSeen;
} */

let currentIndex = 0;

async function getCompleteJson(){
    
    let totalJSON = await fetch("./jsonformatter.json", {
        method: "GET",
    });

    let total = JSON.parse(await totalJSON.text());
    return total;
}


export async function getCurrentJson() {
   
    let total = await getCompleteJson();
    
    let currentJson = total[currentIndex];
    console.log("current graph: ", currentJson);
    currentIndex ++;

    return currentJson;
}

/*export async function getGPSRecords() {

    let gpsRecordsJSON = await fetch("/gpsAllRecords", {
        method: "GET",
    });

    let gpsLastSeenRecord = JSON.parse(await gpsRecordsJSON.text());

    return gpsLastSeenRecord;
} */

export async function getGraph(){

    let graphNetwork = await fetch("./graphPompier.xml");
    
    let fileContent = await graphNetwork.text();

    let parser = new graphml.GraphMLParser();

    return new Promise((res, reject) => parser.parse(fileContent, function (err, graph) {
        if (err) reject(err);
        else res(graph);
    }))
}

/*export async function postGPSLastSeen(payload_coord){

    let res = await fetch("/gps", {
        method: "POST",
        body: payload_coord
    });

    let statusCode = res.status;

    return statusCode;
}

export async function getMyIPAddress(){
    let res = await fetch("/ip", {
        method: "GET", 
    });

    return await res.text();
}

export async function getServerIPAddress(){
    let res = await fetch("/serverIP", {
        method: "GET",
    });

    return await res.text();
} */