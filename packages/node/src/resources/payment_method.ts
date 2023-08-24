import { PAYMENT_METHOD, payment_method } from "zodiac"
import { PAYMENT_METHOD_ENDPOINTS } from "../lib/CONSTANTS"
import got, { RequestError } from "got"
import { DTO } from "../lib/types"
import { isEmpty } from "../lib/cjs/lodash"




class PaymentMethod {

    private api_key: string = ""

    constructor(API_KEY: string) {
        this.api_key = API_KEY
    }


    async createPaymentMethod(data: PAYMENT_METHOD): Promise<PAYMENT_METHOD> {
        const parsed = payment_method.safeParse(data)

        if (!parsed.success) {
            throw new Error("INVALID BODY", { 
                cause: parsed.error.formErrors.fieldErrors
            })
        }
        const { created_at, updated_at, ...parsedData } = parsed.data

        const url = PAYMENT_METHOD_ENDPOINTS.base 

        try {

            const payment_method = await got.post(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData),
            }).json<DTO<PAYMENT_METHOD>>()

            return payment_method.data

        } 
        catch (e)
        {

            console.log("The error::", (e as RequestError)?.code, (e as RequestError)?.cause, (e as RequestError)?.message )
            throw new Error("UNABLE TO CREATE PAYMENT METHOD", {
                cause: (e as RequestError).response?.body
            })
        }

    }   

    async updatePaymentMethod(id: string, data: PAYMENT_METHOD): Promise<PAYMENT_METHOD> {

        if(isEmpty(id)) throw Error("ID CANNT BE EMPTY")

        const parsed = payment_method.safeParse(data)

        if (!parsed.success) {
            throw new Error("INVALID BODY", {
                cause: parsed.error.formErrors.fieldErrors
            }) 
        }

        const { created_at, updated_at, ...parsedData } = parsed.data

        const url = PAYMENT_METHOD_ENDPOINTS.base

        try {

            const payment_method = await got.put(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(parsedData)
            }).json<DTO<PAYMENT_METHOD>>()

            return payment_method.data

        }
        catch (e) 
        {
            throw new Error("UNABLE TO UPDATE PAYMENT METHOD", {
                cause: (e as RequestError).response?.body
            })
        }
    }


    async getPaymentMethod(id: string): Promise<PAYMENT_METHOD> {

        if(isEmpty(id)) throw new Error("ID CANNT BE EMPTY")
        
        const url = PAYMENT_METHOD_ENDPOINTS.base 

        try {

            const payment_method = await got.get(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                }
            }).json<DTO<PAYMENT_METHOD>>()

            return payment_method.data

        }
        catch (e) 
        {
            throw new Error("UNABLE TO GET PAYMENT METHOD", {
                cause: (e as RequestError).response?.body
            })
        }


    }


    async deletePaymentMethod(id: string): Promise<PAYMENT_METHOD> {

        if(isEmpty(id)) throw new Error("ID CANNT BE EMPTY")
        
        const url = PAYMENT_METHOD_ENDPOINTS.base 

        try {

            const payment_method = await got.delete(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                }
            }).json<DTO<PAYMENT_METHOD>>()

            return payment_method.data

        }
        catch (e) 
        {
            throw new Error("UNABLE TO GET PAYMENT METHOD", {
                cause: (e as RequestError).response?.body
            })
        }


    }

}   


export default PaymentMethod