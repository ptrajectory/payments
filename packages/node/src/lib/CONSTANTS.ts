
// the API_URL of the central API server, if any
export const API_HOST = (process.env.API_HOST || "http://localhost:8089") + "/api"


// CUSTOMER SPECIFIC ENDPOINTS 
export const CUSTOMER_ENDPOINTS = {
    base: "/api/customers",
    retrieve:  "/api/customers/{customer_id}",
    update:"/api/customers/{customer_id}",
    archive: "/api/customers/{customer_id}",
}


// CHECKOUT SPECIFIC ENDPOINTS
export const CHECKOUT_ENDPOINTS = {
    base: "/api/checkouts",
    retrieve: "/api/checkouts/{checkout_id}",
    update: "/api/checkouts/{checkout_id}",
    archive: "/api/checkouts/{checkout_id}"
}

// PAYMENT_METHOD SPECIFIC ENDPOINTS
export const PAYMENT_METHOD_ENDPOINTS = {
    base: "/api/payment_methods",
    retrieve: "/api/payment_method/{payment_method_id}",
    update:"/api/payment_method/{payment_method_id}",
    archive: "/api/payment_method/{payment_method_id}",
}

// CART SPECIFIC ENDPOINTS
export const CART_ENDPOINTS = {
    base: "/api/carts",
    retrieve: "/api/carts/{cart_id}",
    update: "/api/carts/{cart_id}",
    archive: "/api/carts/{cart_id}",
    add_item: "/api/carts/{cart_id}",
    update_item: "/api/carts/{cart_id}/{cart_item_id}",
    delete_item: "/api/carts/{cart_id}/{cart_item_id}"
}

// PRODUCT SPECIFIC ENDPOINTS
export const PRODUCT_ENDPOINTS = {
    base: "/api/products",
    retrieve: "/api/products/{product_id}",
    update: "/api/products/{product_id}",
    patch: "/api/products/{product_id}",
}


// PAYMENT SPECIFIC ENDPOINTS
export const PAYMENT_ENDPOINTS = {
    base: "/api/payments",
    retrieve: "/api/payments/{payment_id}",
    update:  "/api/payments/{payment_id}",
    patch: "/api/payments/{payment_id}",
}