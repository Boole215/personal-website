import * as constants from "./constants";

export async function getMyLastFmData(){
    const queryUrl = constants.API_URL + "/lastfm";
    const response = await fetch(queryUrl).then((res)=> res.json());
    return response;
}
