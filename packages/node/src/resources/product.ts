import got, { RequestError } from "got"
import { PRODUCT, product } from "zodiac"
import { PRODUCT_ENDPOINTS } from "../lib/CONSTANTS"


class Product {
    api_key: string = "" 

    constructor(API_KEY: string){
        this.api_key = API_KEY 
    }


    async createProduct(data: PRODUCT) {

        const parsed = product.safeParse(data)

        if(!parsed.success) throw new Error("Invalid body", {
            cause: parsed.error.formErrors.fieldErrors
        })

        try {

            const result = await got.post(PRODUCT_ENDPOINTS.base, {
                headers: {
                    "Authorization": `Beaere ${this.api_key}`
                }
            }).json<PRODUCT>()

            return result

        }
        catch (e)
        {
            throw new Error("Something went wrong", {
                cause: e
            })
        }

    }



    async updateProduct(data: PRODUCT) {

        const parsed = product.safeParse(data)

        if(!parsed.success) throw new Error("Invalid body", {
            cause: parsed.error.formErrors.fieldErrors
        })

        try {

            const result = await got.put(PRODUCT_ENDPOINTS.base, {
                headers: {
                    "Authorization": `Beaere ${this.api_key}`
                }
            }).json<PRODUCT>()

            return result

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

            const product = await got(url, {
                headers: {
                    "Authorization": `Bearer ${this.api_key}`,
                    "Content-Type": "application/json",
                },
                searchParams: {
                    id
                }
            }).json<PRODUCT>()

            return product

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