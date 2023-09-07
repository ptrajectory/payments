import { CHECKOUT, checkout as schema } from "zodiac";
import PaymentsHttpClient, { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net";
import { DTO, UNKNOWN_ERROR } from "../lib/types";
import { CHECKOUT_ENDPOINTS } from "../lib/CONSTANTS";
import { isEmpty } from "../lib/cjs/lodash";


export default class Checkout {

    client: PaymentsHttpClient

    constructor(client: PaymentsHttpClient){
        this.client = client
    }


    /**
     * @name create
     * @param checkout 
     * @description create a checkout object
     * @returns 
     */
    async create(checkout: CHECKOUT) {

        const parsed = schema.safeParse(checkout)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "checkouts")

            const result = await this.client.post(CHECKOUT_ENDPOINTS.base, {
                body: parsed.data
            })
            

            const data = await result.toJSON<DTO<CHECKOUT>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "checkouts")
    }



    /**
     * @name retrieve
     * @param id 
     * @description retrieve checkout
     * @returns 
     */
    async retrieve(id: string){

        if(isEmpty(id)) throw new ParamsError("INVALID ID", "ID")


            const result = await this.client.get(CHECKOUT_ENDPOINTS.retrieve, {
                pathSegments: {
                    checkout_id: id
                }
            })

            const data = await result.toJSON<DTO<CHECKOUT>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "checkouts")

    }

    /**
     * @name update
     * @param id 
     * @param checkout 
     * @description update the checkout object
     * @returns 
     */
    async update(id: string, checkout: CHECKOUT){

        if(isEmpty(id)) throw new ParamsError("INVALID ID", "ID")

        const parsed = schema.safeParse(checkout)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "checkouts")

            const result = await this.client.put(CHECKOUT_ENDPOINTS.retrieve, {
                pathSegments: {
                    checkout_id: id
                },
                body: parsed.data
            })

            const data = await result.toJSON<DTO<CHECKOUT>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "checkouts")

    }

    /**
     * @name archive
     * @param id 
     * @description archive the checkout object
     * @returns 
     */
    async archive(id: string){


        if(isEmpty(id)) throw new ParamsError("INVALID ID", "ID")


            const result = await this.client.patch(CHECKOUT_ENDPOINTS.archive, {
                pathSegments: {
                    checkout_id: id
                }
            })

            const data = await result.toJSON<DTO<CHECKOUT>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "checkouts")

    }
}