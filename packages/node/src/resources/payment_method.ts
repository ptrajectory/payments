import { PAYMENT_METHOD, payment_method } from "zodiac"
import { PAYMENT_METHOD_ENDPOINTS } from "../lib/CONSTANTS"
import got, { RequestError } from "got"




class PaymentMethod {

    private api_key: string = ""

    constructor(API_KEY: string) {
        this.api_key = API_KEY
    }


    async createPaymentMethod(data: PAYMENT_METHOD) {
        const parsed = payment_method.safeParse(data)

        if (!parsed.success) {
            throw new Error("INVALID BODY", {
                cause: parsed.error.formErrors.fieldErrors
            })
        }
        const { created_at, updated_at, ...parsedData } = parsed.data

        const url = PAYMENT_METHOD_ENDPOINTS.base 

        try {

            const payment_method = await got(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData),
            })

            return payment_method

        } 
        catch (e)
        {
            throw new Error("UNABLE TO CREATE PAYMENT METHOD", {
                cause: (e as RequestError).response?.body
            })
        }

    }   

    async updatePaymentMethod(data: PAYMENT_METHOD): Promise<PAYMENT_METHOD> {
        const parsed = payment_method.safeParse(data)

        if (!parsed.success) {
            throw new Error("INVALID BODY", {
                cause: parsed.error.formErrors.fieldErrors
            })
        }

        const { created_at, updated_at, ...parsedData } = parsed.data

        const url = PAYMENT_METHOD_ENDPOINTS.base

        try {

            const payment_method = await got(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(parsedData)
            }).json<PAYMENT_METHOD>()

            return payment_method

        }
        catch (e) 
        {
            throw new Error("UNABLE TO UPDATE PAYMENT METHOD", {
                cause: (e as RequestError).response?.body
            })
        }
    }


    async getPaymentMethod(id: string): Promise<PAYMENT_METHOD> {
        
        const url = PAYMENT_METHOD_ENDPOINTS.base 

        try {

            const payment_method = await got(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                searchParams: {
                    id
                }
            }).json<PAYMENT_METHOD>()

            return payment_method

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