import graphml from "graphml-js";

let currentIndex = 0;

async function getCompleteJson(){
    
    let totalJSON = await fetch("./jsonformatter.json", {
        method: "GET",
    });

    let total = JSON.parse(await totalJSON.text());

    return total;
}


export async function getCurrentJson() {

    let totalJSON = await getCompleteJson();
    
    let currentJson = totalJSON[currentIndex];
    console.log("currentjson: ", currentJson);
    currentIndex ++;

    return currentJson;
}