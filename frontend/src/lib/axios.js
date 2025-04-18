import axios from "axios";


// this is a custom instance of axios, instead of writing axios.get("http://localhost:5001/api/.."), u
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true          // allows axios to send cookies and auth tokens along with the request and receive cookies from the server response
})