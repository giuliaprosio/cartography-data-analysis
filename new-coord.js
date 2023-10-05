export function newCoords(lat1, lng1, lat2, lng2, d_rssi, dist){
    let d_rel = d_rssi/dist;

    let delta_lat = lat2 - lat1;
    let delta_lng = lng2 - lng1;

    let dLat_new = delta_lat*d_rel;
    let dLng_new = delta_lng*d_rel;

    let lat_new = lat1 + dLat_new;
    let lng_new = lng1 + dLng_new;

    return [lat_new, lng_new]



    
}