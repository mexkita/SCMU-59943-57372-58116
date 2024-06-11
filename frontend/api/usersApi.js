import { request } from "./utils/firebaseAux"

const baseUrl = "http://192.168.1.125:8080/api"
const userApi = baseUrl + "/users"


export const createUser = async (user) => {

    console.log("Adding User", user)
    const response = await request("post", userApi, user)
    console.log("Response data: ", response.data)
    return response.data;
}



