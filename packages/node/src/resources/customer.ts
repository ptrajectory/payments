import { CUSTOMER, customer as schema } from "zodiac";
import PaymentsHttpClient, { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net";
import { DTO, UNKNOWN_ERROR } from "../lib/types";
import { CUSTOMER_ENDPOINTS } from "../lib/CONSTANTS";
import { isEmpty } from "../lib/cjs/lodash";



export default class Customer {

    client: PaymentsHttpClient

    constructor(client: PaymentsHttpClient){
        this.client = client
    }


    /**
     * @name create
     * @param {CUSTOMER} customer 
     * @description create a new customer
     * @returns 
     */
    async create(customer: CUSTOMER){

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
     * @param {CUSTOMER} customer 
     * @description update customer
     * @returns 
     */
    async update(id: string, customer: CUSTOMER){

        if(isEmpty(id)) return new ParamsError("INVALID ID", "id")

        const parsed = schema.safeParse(customer)

        if(!parsed.success) return new PaymentsClientParseError(parsed.error, "customers")

            
            const result = await this.client.put(CUSTOMER_ENDPOINTS.update, {
                pathSegments: {
                    customer_id: id
                },
                body: parsed.data
            })

            const data = await result.toJSON<DTO<CUSTOMER>>()

            if(result._res.ok) return data

            throw new PaymentsClientHttpError(result, "customers")

    }

    /**
     * @name archive
     * @param id
     * @description arvhive customer 
     * @returns 
     */
    async archive(id: string){

        if(isEmpty(id)) return new ParamsError("INVALID ID", "id")



            const result = await this.client.patch(CUSTOMER_ENDPOINTS.archive, {
                pathSegments: {
                    customer_id: id
                }
            })

            const data = await result.toJSON<DTO<CUSTOMER>>()
            
            if(result._res.ok) return data

            throw new PaymentsClientHttpError(result, "customer")
 

    }

}