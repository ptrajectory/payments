import { PRODUCT, product as schema  } from "zodiac";
import PaymentsHttpClient, { PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net";
import { PRODUCT_ENDPOINTS } from "../lib/CONSTANTS";
import { DTO, UNKNOWN_ERROR } from "../lib/types";



type CREATE_PRODUCT_DATA = Omit<PRODUCT, "id" | "created_at" | "updated_at" | "store_id" | "status">

type UPDATE_PRODUCT_DATA = Omit<PRODUCT, "id" | "created_at" | "updated_at" | "store_id">

export default class Product {

    client: PaymentsHttpClient 


    constructor(client: PaymentsHttpClient){
        this.client = client
    }


    async create(product: CREATE_PRODUCT_DATA){

        const parsed = schema.safeParse(product)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "products")

            const result = await  this.client.post(PRODUCT_ENDPOINTS.base, {
                body: parsed.data
            })

            const data = await result.toJSON<DTO<PRODUCT>>()

            if(result._res.ok) return data?.data 

            throw new PaymentsClientHttpError(result, "products")

    }


    async retrieve(id: string){


            const result = await this.client.get(PRODUCT_ENDPOINTS.retrieve, {
                pathSegments: {
                    product_id: id
                }
            })


            const data = await result.toJSON<DTO<PRODUCT>>() 

            if(result._res.ok) return data?.data 

            throw new PaymentsClientHttpError(result, "product")

    }


    async update(id: string, data: UPDATE_PRODUCT_DATA) {

        const parsed = schema.safeParse(data)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "products")

            const result = await this.client.put(PRODUCT_ENDPOINTS.update, {
                pathSegments: {
                    product_id: id
                },
                body: parsed.data
            })
    
            const json = await result.toJSON<DTO<PRODUCT>>()
    
            if(result._res.ok) return json?.data
    
            throw new PaymentsClientHttpError(result, "product")

    }

    async archive(id: string){

            const result = await this.client.patch(PRODUCT_ENDPOINTS.patch, {
                pathSegments: {
                    product_id: id
                }
            })

            const json = await result.toJSON<DTO<PRODUCT>>()
    
            if(result._res.ok) return json?.data 
    
            throw new PaymentsClientHttpError(result, "product")

    }


}