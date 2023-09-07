import { PAYMENT_METHOD, payment_method as schema } from "zodiac";
import PaymentsHttpClient, { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net";
import { PAYMENT_METHOD_ENDPOINTS } from "../lib/CONSTANTS";
import { DTO, UNKNOWN_ERROR } from "../lib/types";
import { isEmpty } from "../lib/cjs/lodash";




export default class PaymentMethod {

    client: PaymentsHttpClient

    constructor(client: PaymentsHttpClient){
        this.client = client
    }



    /**
     * @name create
     * @param {PAYMENT_METHOD} payment_method 
     * @param description add a payment method for a customer
     * @returns 
     */
    async create(payment_method: PAYMENT_METHOD) {

        const parsed = schema.safeParse(payment_method)


        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "payment_methods")


        try {
            const result = await this.client.post(PAYMENT_METHOD_ENDPOINTS.base, {
                body: parsed.data
            }) 

            const data = await result.toJSON<DTO<PAYMENT_METHOD>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "payment_method")
        }
        catch(e)
        {
            throw new Error(UNKNOWN_ERROR)
        }

    }


    /**
     * @name retrieve
     * @param id 
     * @description retrieve a specific payment method
     * @returns 
     */
    async retrieve(id: string){

        if(isEmpty(id)) throw new ParamsError("INVALID ID", "id")

        try {

            const result = await this.client.get(PAYMENT_METHOD_ENDPOINTS.retrieve, {
                pathSegments: {
                    payment_method_id: id
                }
            })

            const data = await result.toJSON<DTO<PAYMENT_METHOD>>()

            if(result._res.ok) return data?.data 

            throw new PaymentsClientHttpError(result, "payment_methods")

        }
        catch (e)
        {
            throw new Error(UNKNOWN_ERROR)
        }

    }


    /**
     * @name update
     * @param id 
     * @param payment_method 
     * @description update a payment method
     * @returns 
     */
    async update(id: string, payment_method: PAYMENT_METHOD){

        if(isEmpty(id)) throw new ParamsError("INVALID ID", "id")

        const parsed = schema.safeParse(payment_method)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "payment_methods")


        try{

            const result = await this.client.put(PAYMENT_METHOD_ENDPOINTS.update, {
                pathSegments: {
                    payment_method_id: id
                },
                body: parsed.data
            })


            const data = await result.toJSON<DTO<PAYMENT_METHOD>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "payment_methods")


        }
        catch (e)
        {
            throw new Error(UNKNOWN_ERROR)
        }


    }


    /**
     * 
     * @param id 
     * @description archive a payment method
     * @returns 
     */
    async archive(id: string){

        if(isEmpty(id)) throw new ParamsError("INVALID ID", "id")

            const result = await this.client.patch(PAYMENT_METHOD_ENDPOINTS.archive, {
                pathSegments: {
                    payment_method_id: id
                }
            })

            const data = await result.toJSON<DTO<PAYMENT_METHOD>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "payment_methods")

    }

}