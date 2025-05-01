import axios from "axios";
import { getSession } from "next-auth/react"


const API_URL =process.env.API_URL || "http://localhost:5000"

export async function fetchWithAuth(endpoint,options={}){
    console.log("reason bolo");
   const session = await getSession();

   if(!session){
    throw new Error("Not authenticated")
   }
 
   try{
    console.log("iv vn");
    console.log(endpoint);
    console.log(`${API_URL}${endpoint}`);
    
       const response =await axios({
        url:`${API_URL}${endpoint}`,
        method:options.method || "GET",
        headers:{
            Authorization:`Bearer ${session.idToken}`,
            ...options.headers
        },
        data:options.body,
        params: options.params
       })
       console.log(response,"reason bolo");
       
       return response.data
   }catch(e){
    throw new Error("Api request failed")
   }
}