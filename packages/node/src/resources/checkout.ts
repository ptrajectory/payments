import { CHECKOUT, PAYMENT, PAYMEN_INPUT, payment_input, checkout as schema } from "zodiac";
import PaymentsHttpClient, { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net";
import { DTO, UNKNOWN_ERROR } from "../lib/types";
import { CHECKOUT_ENDPOINTS, PAYMENT_ENDPOINTS } from "../lib/CONSTANTS";
import { isEmpty } from "../lib/cjs/lodash";


type CHECKOUT_CREATE_DATA = Omit<CHECKOUT, "id" | "created_at" | "updated_at" | "status" | "store_id">

type CHECKOUT_UPDATE_DATA = Omit<CHECKOUT, "id" | "created_at" | "updated_at" | "store_id">

type PAYMENT_INPUT_DATA = Omit<PAYMEN_INPUT, "customer_id" | "payment_method_id" | "amount" | "payment_option" | "phone_number">

export default class Checkout {

    private client: PaymentsHttpClient

    constructor(client: PaymentsHttpClient){
        this.client = client
    }


    /**
     * @name create
     * @param checkout 
     * @description create a checkout object
     * @returns 
     */
    async create(checkout: CHECKOUT_CREATE_DATA ) {

        const parsed = schema.safeParse(checkout)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "checkouts")

            const result = await this.client.post(CHECKOUT_ENDPOINTS.base, {
                body: parsed.data
            })
            

            const data = await result.toJSON<DTO<CHECKOUT & { ephemeralKey: string }>>()

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
    async update(id: string, checkout: CHECKOUT_UPDATE_DATA){

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



    /**
     * enablePayments on the client side with ephemeral links
     * @param ephemeralKey 
     * @param body 
     * @returns 
     */
    async pay(ephemeralKey: string, body: Required<PAYMENT_INPUT_DATA>){

        if(isEmpty(ephemeralKey)) throw new ParamsError("INVALID ephemeral key", "ephemeral key")


        const parsed = payment_input.safeParse(body)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "checkout payments")


        const result = await this.client.post(PAYMENT_ENDPOINTS.base, {
            headers: {
                "X-Ephemeral-Key": ephemeralKey
            },
            body: parsed.data
        })

        if(!result._res.ok) throw new PaymentsClientHttpError(result, "payment")

        const data = await result.toJSON<DTO<PAYMENT>>()

        return data?.data

    }
}