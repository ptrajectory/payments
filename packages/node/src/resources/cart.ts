import got, { RequestError } from "got"
import { CART, CART_ITEM, cart, cart_item } from "zodiac"
import { CART_ENDPOINTS } from "../lib/CONSTANTS"
import { DTO } from "src/lib/types"



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
                json:(parsed.data),
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<CART>>()

            return result.data
        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: e
            })
        }

    }


    async updateCart(id: string, data: CART){
        const parsed = cart.safeParse(data)

        if(!parsed.success) throw new Error("Invalid Cart body", {
            cause: parsed.error.formErrors.fieldErrors
        })

        try {

            const result = await got.put(`${CART_ENDPOINTS.base}/${id}`, {
                json: parsed.data,
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<CART>>()

            return result.data

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

            const result = await got.get(`${CART_ENDPOINTS.base}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<CART & {
                items: CART_ITEM[]
            }>>()

            return result.data

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
            const result = await got.post(`${CART_ENDPOINTS.base}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                },
                json: {
                    ...parsed.data,
                    cart_id: id
                }
            }).json<DTO<CART_ITEM>>()

            return result.data
        }
        catch (e)
        {
            throw new Error("Somthing went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }
    }


    async updateCartItem(id: string, cart_id: string, data: CART_ITEM){
        const parsed = cart_item.safeParse(data)

        if(!parsed.success) throw new Error("Unable to add cart item.", {
            cause: parsed.error.formErrors.fieldErrors
        })


        try {
            const result = await got.put(`${CART_ENDPOINTS.base}/${cart_id}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                },
                json: parsed.data
            }).json<DTO<CART_ITEM>>()

            return result.data
        }
        catch (e)
        {
            throw new Error("Somthing went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }
    }


    async deleteCart(id: string) {

        try {

            const result = await got.delete(`${CART_ENDPOINTS.base}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<CART>>()

            return result.data

        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }

    }

    async deleteCartItem(id: string, cart_id: string) {

        try {

            const result = await got.delete(`${CART_ENDPOINTS.base}/${cart_id}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<CART_ITEM>>()

            return result.data

        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }

    }





}


export default Cart