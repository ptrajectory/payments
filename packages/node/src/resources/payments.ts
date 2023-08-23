import got, { RequestError } from "got"
import { CART, CART_ITEM, PAYMENT, cart, cart_item, payment } from "zodiac"
import { CART_ENDPOINTS, PAYMENT_ENDPOINTS } from "../lib/CONSTANTS"
import { isEmpty, isUndefined } from "lodash"
import { DTO } from "src/lib/types"



class Payment {
    private api_key: string = ""
    constructor(API_KEY: string){
        this.api_key = API_KEY 
    }


    async createPayment(data: PAYMENT){

        const parsed = payment.safeParse(data)

        if(!parsed.success) throw new Error("Invalid Payment body", {
            cause: parsed.error.formErrors.fieldErrors
        })


        try {
            const result = await got.post(PAYMENT_ENDPOINTS.base, {
                json: parsed.data,
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<PAYMENT>>()

            return result.data
        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: e
            })
        }

    }


    async updatePayment(id: string, data: PAYMENT){
        const parsed = payment.safeParse(data)

        if(!parsed.success) throw new Error("Invalid Payment body", {
            cause: parsed.error.formErrors.fieldErrors
        })


        if(isEmpty(id) || isUndefined(id)) throw new Error("ID not specified", {
            cause: "The ID is either an empty string or and undefined value"
        })
        

        try {

            const result = await got.put(`${PAYMENT_ENDPOINTS.base}/${id}`, {
                json: parsed.data,
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<PAYMENT>>()

            return result.data

        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }
    }


    async getPayment(id: string) {


        try {

            const result = await got.get(`${PAYMENT_ENDPOINTS.base}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<PAYMENT>>()

            return result.data

        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: (e as RequestError)?.response?.body
            })
        }

    }

    async deletePayment(id: string) {
        try {

            const result = await got.delete(`${PAYMENT_ENDPOINTS.base}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                }
            }).json<DTO<PAYMENT>>()

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


export default Payment