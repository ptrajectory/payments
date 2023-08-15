import { CUSTOMER_ENDPOINTS } from "../lib/CONSTANTS"
import { CUSTOMER, customer } from "zodiac"
import got, { RequestError } from "got"

class Customer {
    private api_key: string = ""
    constructor(API_KEY: string){
        this.api_key = API_KEY
    }


    async createCustomers(data: CUSTOMER){
        const parsed = customer.safeParse(data)

        if (!parsed.success) {
            throw new Error("INVALID BODY", {
                cause: parsed.error.formErrors.fieldErrors
            })
        }
        const {created_at, updated_at,...parsedData} = parsed.data


        const url = CUSTOMER_ENDPOINTS.base


        try {
            const customer = await got(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(parsedData),
                method: "POST"
            }).json<CUSTOMER>()

            return customer 

        }
        catch (e) 
        {   
            throw new Error("UNABLE TO CREATE CUSTOMER", {
                cause: (e as RequestError).response?.body
            })
        }
    }


    async updateCustomer(data: CUSTOMER): Promise<CUSTOMER> {
        const parsed = customer.safeParse(data)

        if (!parsed.success) {
            throw new Error("INVALID BODY", {
                cause: parsed.error.formErrors.fieldErrors
            })
        }
        const {created_at, updated_at,...parsedData} = parsed.data

        const url = CUSTOMER_ENDPOINTS.base

        try{
            const customer = await got(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData),
                method: "PUT"
            }).json<CUSTOMER>()

            return customer
        }
        catch (e)
        {
            throw new Error("UNABLE TO UPDATE CUSTOMER", {
                cause: (e as RequestError).response?.body
            })
        }
    }


    async getCustomer(id: string): Promise<CUSTOMER>{
        
        const url = CUSTOMER_ENDPOINTS.base

        try {

            const customer = await got(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                searchParams: {
                    id
                }
            }).json<CUSTOMER>()

            return customer

        }
        catch (e)
        {
            throw new Error("UNABLE TO GET CUSTOMER", {
                cause: (e as RequestError).response?.body
            })
        }
    }

    



}


export default Customer