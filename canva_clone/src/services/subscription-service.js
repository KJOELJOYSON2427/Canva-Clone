
import { fetchWithAuth } from "./base-service";

export async function getUserSubscription() {
    
    return fetchWithAuth('/v1/subscription',{
        method:"GET"
    })
}

export async function createPayPalOrder() {
    
    return fetchWithAuth('/v1/subscription/create-order',{
        method:"POST"
    })
}

export async function capturePayPalOrder(orderId) {
    
    return fetchWithAuth('/v1/subscription/capture-order',{
        method:"POST",
        body:{
            orderId
        }
    })
}