import { request } from "./utils/firebaseAux"

const baseUrl = "http://192.168.1.125:8080/api"
const parkApi = baseUrl + "/park"


export const addBooking = async (parkId, userId, reservation) => {
    console.log("Adding Book")
    console.log(parkId, userId, reservation)
    const response = await request("get", parkApi + "/book_spot/" + parkId + "/users/" + userId, reservation)
    console.log("Response ", response)
    return response.data;
}

export const getAllParks = async () => {

    console.log('Retrieving Parks');
    const response = await request('get', parkApi);
    console.log('Response data:', response.data);
    return response.data;
}

