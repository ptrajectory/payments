
// the API_URL of the central API server, if any
export const API_HOST = (process.env.API_HOST || "http://localhost:8089") + "/api"


// CUSTOMER SPECIFIC ENDPOINTS 
export const CUSTOMER_ENDPOINTS = {
    base: API_HOST + "/customers",
    create: API_HOST + "/customer/create",
    update: API_HOST + "/customer/update",
}


// CHECKOUT SPECIFIC ENDPOINTS
export const CHECKOUT_ENDPOINTS = {
    base: API_HOST + "/checkouts",
    create: API_HOST + "/checkout/create",
    update: API_HOST + "/checkout/update",
}

// PAYMENT_METHOD SPECIFIC ENDPOINTS
export const PAYMENT_METHOD_ENDPOINTS = {
    base: API_HOST + "/payment_methods",
    create: API_HOST + "/payment_method/create",
    update: API_HOST + "/payment_method/update",
}

