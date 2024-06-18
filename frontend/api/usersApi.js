import { request } from "./utils/firebaseAux"

//const baseUrl = "http://192.168.1.10:8080/api"
const baseUrl = "http://192.168.163.82:8080/api"
const userApi = baseUrl + "/users"


export const createUser = async (user) => {

    console.log("Adding User", user)
    const response = await request("post", userApi, user)
    console.log("Response data: ", response.data)
    return response.data;
}

export const getCurrentParkingTime = async (userId) => {

    console.log("Getting Current time from user ->", userId)
    const response = await request('get', userApi + '/elapsed/' + userId);
    console.log("Response data: ", response.data)
    return response.data;


}

export const getReservationsByUser = async (userId) => {

    console.log("Getting reservations from user ->", userId)
    const response = await request('get', userApi + '/reservation/' + userId);
    console.log("Response data: ", response.data)
    return response.data;


}


export const startParking = async (userId, parkingId) => {

    console.log("Starting parking with user ->", userId)
    const response = await request('post', userApi + '/start_stay/' + userId + '/parks/' + parkingId);
    console.log("Response data: ", response.data)
    return response.data;
}

export const finishParking = async (userId) => {

    console.log("Fisnish parking with user ->", userId)
    const response = await request('post', userApi + '/finish_stay/' + userId);
    console.log("Response data: ", response.data)
    return response.data;
}



