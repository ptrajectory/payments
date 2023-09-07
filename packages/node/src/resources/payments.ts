import { PAYMENT, payment as schema } from "zodiac"
import PaymentsHttpClient, { PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net"
import { PAYMENT_ENDPOINTS } from "../lib/CONSTANTS"
import { DTO, UNKNOWN_ERROR } from "../lib/types"


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
    async start(body: PAYMENT){
        
        const parsed = schema.safeParse(body)

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
     * @param {PAYMENT} data 
     * @returns 
     * @description - update a payment
     */
    async update(id: string, payment: PAYMENT){ 

        const parsed = schema.safeParse(payment)


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

}