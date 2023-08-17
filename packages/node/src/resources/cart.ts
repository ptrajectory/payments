import got, { RequestError } from "got"
import { CART, CART_ITEM, cart, cart_item } from "zodiac"
import { CART_ENDPOINTS } from "../lib/CONSTANTS"



class Cart {
    private api_key: string = ""
    constructor(API_KEY: string){
        this.api_key = API_KEY 
    }


    async createCart(data: CART){

        const parsed = cart.safeParse(data)

        if(!parsed.success) throw new Error("Invalid Cart body", {
            cause: parsed.error.formErrors.fieldErrors
        })


        try {
            const result = await got.post(CART_ENDPOINTS.base, {
                body: JSON.stringify(parsed.data),
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<CART>()

            return result
        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: e
            })
        }

    }


    async updateCart(data: CART){
        const parsed = cart.safeParse(data)

        if(!parsed.success) throw new Error("Invalid Cart body", {
            cause: parsed.error.formErrors.fieldErrors
        })

        try {

            const result = await got.put(CART_ENDPOINTS.base, {
                body: JSON.stringify(parsed.data),
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<CART>()

            return result

        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }
    }


    async getCart(id: string) {


        try {

            const result = await got.put(`${CART_ENDPOINTS.base}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<CART & {
                cart_items: CART_ITEM[]
            }>()

            return result

        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }

    }

    async addCartItem(id: string, data: CART_ITEM){
        const parsed = cart_item.safeParse(data)

        if(!parsed.success) throw new Error("Unable to add cart item.", {
            cause: parsed.error.formErrors.fieldErrors
        })


        try {
            const result = await got.post(`${CART_ENDPOINTS.base}/${id}/cart_items`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                },
                body: JSON.stringify(parsed.data)
            })

            return result
        }
        catch (e)
        {
            throw new Error("Somthing went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }
    }
}


export default Cart