import { PAYMENT, PAYMEN_INPUT, payment as schema, payment_input } from "zodiac"
import PaymentsHttpClient, { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net"
import { PAYMENT_ENDPOINTS } from "../lib/CONSTANTS"
import { DTO, UNKNOWN_ERROR } from "../lib/types"
import { isEmpty } from "../lib/cjs/lodash"


type UPDATE_PAYMENT_METHOD_DATA = Omit<PAYMENT, "id" | "updated_at" | "created_at" | "token" | "amount" | "payment_method_id" | "customer_id" | "checkout_id" | "store_id">


export default class Payment {
    private _httpClient


    constructor(client: PaymentsHttpClient){
        this._httpClient = client
    }


    /**
     * @name start
     * @param {PAYMENT} body
     * @description initialize a checkout payment
     */
    async start(body: PAYMEN_INPUT){
        
        const parsed = payment_input.safeParse(body)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "payments")

            const result = await this._httpClient.post(PAYMENT_ENDPOINTS.base, {
                body: parsed.data
            })

            const data = await result.toJSON<DTO<PAYMENT>>()

            if(result._res.ok) return data?.data


            throw new PaymentsClientHttpError(result, "payments")

    }


    /**
     * @name retrieve
     * @param {string} id
     * @description - retrieves a payment object
     */
    async retrieve(id: string){

            const result = await this._httpClient.get(PAYMENT_ENDPOINTS.retrieve, {
                pathSegments: {
                    payment_id: id
                }
            })


            const data = await result.toJSON<DTO<PAYMENT>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "payments")

    }


    /**
     * @name update
     * @param {string} id 
     * @param {UPDATE_PAYMENT_METHOD_DATA} payment 
     * @returns 
     * @description - update a payment
     */
    async update(id: string, payment: UPDATE_PAYMENT_METHOD_DATA){ 
        const { status } = payment
        const parsed = schema.required({
            status: true
        }).safeParse({
            status
        })


        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "payments")

            const result = await this._httpClient.put(PAYMENT_ENDPOINTS.update, {
                pathSegments: {
                    payment_id: id
                },
                body: parsed.data
            })

            
            const data =  await result.toJSON<DTO<PAYMENT>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "payments")

    }


    /**
     * @name confirm
     * @param id 
     * @description confirm if a payment was successful receive back the payment status
     * @returns 
     */
    async confirm(id: string){

        if(isEmpty(id)) throw new ParamsError("ID is required", "payments")

        const result = await this._httpClient.get(PAYMENT_ENDPOINTS.confirm, {
            pathSegments: {
                payment_id: id
            }
        })


        const data = await result.toJSON<DTO<string>>()

        if(result._res.ok) return data?.data

        throw new PaymentsClientHttpError(result, "payments")

    }


}