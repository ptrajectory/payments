import { CHECKOUT, checkout } from "zodiac"
import { CHECKOUT_ENDPOINTS } from "../lib/CONSTANTS"
import got, { RequestError } from "got"
import { DTO } from "../lib/types"



class Checkout {

    private api_key: string = ""

    constructor(API_KEY: string) {
        this.api_key = API_KEY
    }

    async createCheckout(data: CHECKOUT) {
        const parsed = checkout.safeParse(data)

        if (!parsed.success) {
            throw new Error("INVALID BODY", {
                cause: parsed.error.formErrors.fieldErrors
            })
        }

        const { created_at, updated_at, ...parsedData } = parsed.data

        const url = CHECKOUT_ENDPOINTS.base 

        try {

            const checkout = await got.post(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData),
                method: "POST"
            }).json<DTO<CHECKOUT>>()

            return checkout.data

        }
        catch (e)
        {
            throw new Error("UNABLE TO CREATE CHECKOUT", {
                cause: (e as RequestError).response?.body
            })
        }
    }

    async updateCheckout(id: string, data: CHECKOUT): Promise<CHECKOUT> {
        const parsed = checkout.safeParse(data) 

        if (!parsed.success) {
            throw new Error("INVALID BODY", {
                cause: parsed.error.formErrors.fieldErrors
            })
        }

        const { created_at, updated_at, ...parsedData } = parsed.data

        const url = CHECKOUT_ENDPOINTS.base

        try {
            const checkout = await got.put(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData),
            }).json<DTO<CHECKOUT>>()

            return checkout.data

        }
        catch (e)
        {
            throw new Error("UNABLE TO UPDATE CHECKOUT", {
                cause: (e as RequestError).response?.body
            })
        }
    }


    async getCheckout(id: string): Promise<CHECKOUT> {
        const url = CHECKOUT_ENDPOINTS.base

        try {
            const checkout = await got.get(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                }
            }).json<DTO<CHECKOUT>>()

            return checkout.data
        }
        catch (e)
        {
            throw new Error("UNABLE TO GET CHECKOUT", {
                cause: (e as RequestError).response?.body
            })
        }
    }

    async deleteCheckout(id: string): Promise<CHECKOUT> {
        const url = CHECKOUT_ENDPOINTS.base

        try {
            const checkout = await got.delete(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                }
            }).json<DTO<CHECKOUT>>()

            return checkout.data
        }
        catch (e)
        {
            throw new Error("UNABLE TO GET CHECKOUT", {
                cause: (e as RequestError).response?.body
            })
        }
    }

}


export default Checkout