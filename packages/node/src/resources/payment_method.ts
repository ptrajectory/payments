import { PAYMENT_METHOD, payment_method as schema } from "zodiac";
import PaymentsHttpClient, { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net";
import { PAYMENT_METHOD_ENDPOINTS } from "../lib/CONSTANTS";
import { DTO, UNKNOWN_ERROR } from "../lib/types";
import { isEmpty } from "../lib/cjs/lodash";



type CREATE_PAYMENT_METHOD_DATA = Omit<PAYMENT_METHOD, "id" | "created_at" | "updated_at" | "status" | "store_id">

type UPDATE_PAYMENT_METHOD_DATA = Omit<PAYMENT_METHOD, "id" | "created_at" | "updated_at" | "store_id">

export default class PaymentMethod {

    private client: PaymentsHttpClient

    constructor(client: PaymentsHttpClient){
        this.client = client
    }



    /**
     * @name create
     * @param {CREATE_PAYMENT_METHOD_DATA} payment_method 
     * @param description add a payment method for a customer
     * @returns 
     */
    async create(payment_method: CREATE_PAYMENT_METHOD_DATA) {

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
    async update(id: string, payment_method: UPDATE_PAYMENT_METHOD_DATA){

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