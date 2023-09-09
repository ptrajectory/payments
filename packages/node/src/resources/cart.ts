import { CART, CART_ITEM, cart as schema, cart_item as sub_schema } from "zodiac";
import PaymentsHttpClient, { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from "../lib/net";
import { DTO, UNKNOWN_ERROR } from "../lib/types";
import { CART_ENDPOINTS } from "../lib/CONSTANTS";
import { isEmpty } from "../lib/cjs/lodash";


type CART_CREATE_DATA = Omit<CART, "id" | "created_at" | "updated_at" | "status" | "store_id">

type CART_UPDATE_DATA = Omit<CART, "id" | "store_id" | "created_at" | "updated_at" >


export default class Cart {

    private client: PaymentsHttpClient 


    constructor(client: PaymentsHttpClient){
        this.client = client
    }


    /**
     * @name create
     * @param cart 
     * @description create a cart
     * @returns 
     */
    async create(cart: CART_CREATE_DATA) {

        const parsed = schema.safeParse(cart)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "cart")


            const result = await this.client.post(CART_ENDPOINTS.base, {
                body: parsed.data
            })

            const data = await result.toJSON<DTO<CART>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result,'carts')

    }

    /**
     * @name retrieve
     * @param id 
     * @description retrieve a cart
     * @returns 
     */
    async retrieve(id: string){

        if(isEmpty(id)) throw new ParamsError("Invalid ID", "ID")

            const result = await this.client.get(CART_ENDPOINTS.retrieve, {
                pathSegments: {
                    cart_id: id
                }
            })

            const data = await result.toJSON<DTO<CART & { items: Array<CART_ITEM> }>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "carts")
 


    }

    /**
     * @name update
     * @param id 
     * @param cart
     * @description update a cart 
     * @returns 
     */
    async update(id: string, cart: CART_UPDATE_DATA){

        if(isEmpty(id)) throw new ParamsError("Invalid ID", "ID")

        const parsed = schema.safeParse(cart)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "cart")

            const result = await this.client.put(CART_ENDPOINTS.update, {
                pathSegments: {
                    cart_id: id
                },
                body: parsed.data
            })

            const data = await result.toJSON<DTO<CART>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "carts")


    }


    /**
     * @name archive
     * @param id 
     * @description archive a cart
     * @returns 
     */
    async archive(id: string){

        if(isEmpty(id)) return new ParamsError("Invalid ID", "ID")

            const result = await this.client.patch(CART_ENDPOINTS.retrieve, {
                pathSegments: {
                    cart_id: id
                }
            })

            const data = await result.toJSON<DTO<CART>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "carts")

    }

    /**
     * @name addCartItem
     * @param cart_id 
     * @param cart_item 
     * @description add an item to the cart
     * @returns 
     */
    async addCartItem(cart_id: string, cart_item: CART_ITEM) {

        if(isEmpty(cart_id)) throw new ParamsError("Invalid CART ID", "CART ID")

        const parsed = sub_schema.safeParse(cart_item)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "cart_items")

            const result = await this.client.post(CART_ENDPOINTS.add_item, {
                pathSegments: {
                    cart_id
                },
                body: {
                    ...parsed.data,
                    cart_id
                }
            })


            const data = await result.toJSON<DTO<CART_ITEM>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "carts")

    }


    /**
     * @name updateCartItem
     * @param cart_id 
     * @param cart_item_id 
     * @param cart_item 
     * @description update a cart item
     * @returns 
     */
    async updateCartItem(cart_id: string, cart_item_id: string, cart_item: CART_ITEM){

        if(isEmpty(cart_id)) throw new ParamsError("Invalid CART ID", "CART ID")

        if(isEmpty(cart_item_id)) throw new ParamsError("Invalid CART ITEM ID", "CART ITEM ID")

        const parsed = sub_schema.safeParse(cart_item)

        if(!parsed.success) throw new PaymentsClientParseError(parsed.error, "cart_items")

            const result = await this.client.put(CART_ENDPOINTS.update_item, {
                pathSegments: {
                    cart_id,
                    cart_item_id
                },
                body: parsed.data
            })

            const data = await result.toJSON<DTO<CART_ITEM>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "payments")


    }


    /**
     * @name deleteCartItem
     * @param cart_id 
     * @param cart_item_id 
     * @description delete a cart item
     * @returns 
     */
    async deleteCartItem(cart_id: string, cart_item_id: string){

        if(isEmpty(cart_id)) throw new ParamsError("Invalid CART ID", "CART ID")

        if(isEmpty(cart_item_id)) throw new ParamsError("Invalid CART ITEM ID", "CART ITEM ID")
  

            const result = await this.client.delete(CART_ENDPOINTS.delete_item, {
                pathSegments: {
                    cart_id,
                    cart_item_id
                }
            })

            const data = await result.toJSON<DTO<CART_ITEM>>()

            if(result._res.ok) return data?.data

            throw new PaymentsClientHttpError(result, "cart_items")



    }

}