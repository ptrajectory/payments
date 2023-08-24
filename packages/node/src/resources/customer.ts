import { CUSTOMER_ENDPOINTS } from "../lib/CONSTANTS"
import { CUSTOMER, customer } from "zodiac"
import got, { RequestError } from "got"
import { DTO } from "../lib/types"
import { isEmpty, isNull, isUndefined } from "../lib/cjs/lodash"

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
            }).json<DTO<CUSTOMER>>()

            return customer.data 

        }
        catch (e) 
        {   
            throw new Error("UNABLE TO CREATE CUSTOMER", {
                cause: (e as RequestError).response?.body
            })
        }
    }


    async updateCustomer(id: string, data: CUSTOMER): Promise<CUSTOMER> {
        const parsed = customer.safeParse(data)

        if(isEmpty(id)) throw new Error("ID NOT PROVIDED")

        if (!parsed.success) {
            throw new Error("INVALID BODY", {
                cause: parsed.error.formErrors.fieldErrors
            })
        }
        const {created_at, updated_at,...parsedData} = parsed.data

        const url = CUSTOMER_ENDPOINTS.base

        try{
            const customer = await got.put(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData),
                method: "PUT"
            }).json<DTO<CUSTOMER>>()

            return customer.data
        }
        catch (e)
        {
            throw new Error("UNABLE TO UPDATE CUSTOMER", {
                cause: (e as RequestError).response?.body
            })
        }
    }


    async getCustomer(id: undefined | string | null = null): Promise<CUSTOMER>{
        
        const url = CUSTOMER_ENDPOINTS.base

        if(isUndefined(id) || isNull(id) ) throw new Error("ID NOT PROVIDED")

        try {

            const customer = await got.get(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                }
            }).json<DTO<CUSTOMER>>()

            return customer.data

        }
        catch (e)
        {
            throw new Error("UNABLE TO GET CUSTOMER", {
                cause: (e as RequestError).response?.body
            })
        }
    }


    async deleteCustomer(id: undefined | string | null = null): Promise<CUSTOMER>{
        
        const url = CUSTOMER_ENDPOINTS.base

        if(isUndefined(id) || isNull(id) ) throw new Error("ID NOT PROVIDED")

        try {

            const customer = await got.delete(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                }
            }).json<DTO<CUSTOMER>>()

            return customer.data

        }
        catch (e)
        {
            throw new Error("UNABLE TO DELETE CUSTOMER", {
                cause: (e as RequestError).response?.body
            })
        }
    }




    



}


export default Customer