import got, { RequestError } from "got"
import { PRODUCT, product } from "zodiac"
import { PRODUCT_ENDPOINTS } from "../lib/CONSTANTS"
import { DTO } from "src/lib/types"


class Product {
    api_key: string = "" 

    constructor(API_KEY: string){
        this.api_key = API_KEY 
    }


    async createProduct(data: PRODUCT) {
        console.log("Ingoing data::", data)
        const parsed = product.safeParse(data)

        if(!parsed.success) throw new Error("Invalid body", {
            cause: parsed.error.formErrors.fieldErrors
        })

        const parsedData = parsed.data

        try {

            const result = await got.post(PRODUCT_ENDPOINTS.base, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`
                },
                json: parsedData
            }).json<DTO<PRODUCT>>()

            return result.data

        }
        catch (e)
        {

            console.log((e as RequestError)?.code)
            console.log((e as RequestError)?.message)
            console.log((e as RequestError)?.response?.body)
            throw new Error("Something went wrong", {
                cause: e
            })
        }

    }



    async updateProduct(id: string, data: PRODUCT) {

        const parsed = product.safeParse(data)

        if(!parsed.success) throw new Error("Invalid body", {
            cause: parsed.error.formErrors.fieldErrors
        })

        const parsedData = parsed.data

        try {

            const result = await got.put(`${PRODUCT_ENDPOINTS.base}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(parsedData)
            }).json<DTO<PRODUCT>>()

            return result.data

        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: e
            })
        }

    }

    async getProduct(id: string) {
        
        const url = PRODUCT_ENDPOINTS.base 

        try {

            const product = await got.get(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
            }).json<DTO<PRODUCT>>()

            return product.data

        }
        catch (e) 
        {
            throw new Error("UNABLE TO GET PAYMENT METHOD", {
                cause: (e as RequestError).response?.body
            })
        }


    }


    async deleteProduct(id: string) {
        
        const url = PRODUCT_ENDPOINTS.base 

        try {

            const product = await got.delete(`${url}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
            }).json<DTO<PRODUCT>>()

            return product.data

        }
        catch (e) 
        {
            throw new Error("UNABLE TO GET PAYMENT METHOD", {
                cause: (e as RequestError).response?.body
            })
        }


    }



}


export default Product