/*
STATIC CONVERSION OF RSSI INTO DISTANCE
TAKES IN INPUT THE EDGES OF THE GRAPH AND FOR EACH RSSI VALUE CALCULATES CORRESPONDING
APPROX DISTANCE WITH STATIC PARAMETERS, ADDING DISTANCE ELEMENT IN GRAPH
 */

let measuredPower = -21; //from data collected in Anne experiment
let N = 2.4;


export function rssiConversion(rssi){

    return 10^((measuredPower - rssi)/(10*N));

}