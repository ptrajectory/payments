import { CUSTOMER, customer as schema } from "zodiac";
import PaymentsHttpClient, { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net";
import { DTO, UNKNOWN_ERROR } from "../lib/types";
import { CUSTOMER_ENDPOINTS } from "../lib/CONSTANTS";
import { isEmpty } from "../lib/cjs/lodash";


type CUSTOMER_CREATE_DATA = Omit<CUSTOMER, "created_at" | "updated_at" | "status" | "store_id" | "id" | "meta"> // TODO: add in meta later when its clear what values it should be able to support

type CUSTOMER_UPDATE_DATA = Omit<CUSTOMER, "created_at" | "updated_at" | "store_id" | "id" | "meta"> 

export default class Customer {

    private client: PaymentsHttpClient

    constructor(client: PaymentsHttpClient){
        this.client = client
    }


    /**
     * @name create
     * @param {CUSTOMER_UPDATE_DATA} customer 
     * @description create a new customer
     * @returns 
     */
    async create(customer: CUSTOMER_CREATE_DATA){

            const parsed = schema.safeParse(customer)

            if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "customer")

            const result = await this.client.post(CUSTOMER_ENDPOINTS.base, {
                body: parsed.data
            })

            const data = await result.toJSON<DTO<CUSTOMER>>()

            if(result._res.ok) return data?.data


            throw new PaymentsClientHttpError(result, "customers")


    }


    /**
     * @name retrieve
     * @param {string} id
     * @description retrieve a customer
     * @returns 
     */
    async retrieve(id: string){

            if(isEmpty(id)) throw new ParamsError("INVALID ID", "id")


            const result = await this.client.get(CUSTOMER_ENDPOINTS.retrieve, {
                pathSegments: {
                    customer_id: id
                }
            })

            const data = await result.toJSON<DTO<CUSTOMER>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "customers")

    }


    /**
     * @name update
     * @param {string } id
     * @param {CUSTOMER_UPDATE_DATA} customer 
     * @description update customer
     * @returns 
     */
    async update(id: string, customer: CUSTOMER_UPDATE_DATA){

        if(isEmpty(id)) throw new ParamsError("INVALID ID", "id")

        const parsed = schema.safeParse(customer)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "customers")

            
            const result = await this.client.put(CUSTOMER_ENDPOINTS.update, {
                pathSegments: {
                    customer_id: id
                },
                body: parsed.data
            })

            const data = await result.toJSON<DTO<CUSTOMER>>()

            if(result._res.ok) return data?.data 

            throw new PaymentsClientHttpError(result, "customers")

    }

    /**
     * @name archive
     * @param id
     * @description arvhive customer 
     * @returns 
     */
    async archive(id: string){

        if(isEmpty(id)) throw new ParamsError("INVALID ID", "id")



            const result = await this.client.patch(CUSTOMER_ENDPOINTS.archive, {
                pathSegments: {
                    customer_id: id
                }
            })

            const data = await result.toJSON<DTO<CUSTOMER>>()
            
            if(result._res.ok) return data?.data 

            throw new PaymentsClientHttpError(result, "customer")
 

    }

}