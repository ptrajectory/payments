import { CART_ITEM, cart_item } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";



type CreateCartItem = Omit<NonNullable<CART_ITEM>, "id"| "status">

type UpdateCartItem = Omit<NonNullable<CART_ITEM>, "id"| "status">

type GetCartItem = CART_ITEM | null


class CartItem implements IService {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreateCartItem): Promise<GetCartItem> {

        const data = parser<CreateCartItem>(cart_item, arg);

        const result = await this._db.insert(this._schema.CART_ITEM).values({
            ...data,
            id: generate_unique_id("crt_itm")
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdateCartItem): Promise<GetCartItem> {

        const data = parser<UpdateCartItem>(cart_item, arg)

        const result = await this._db.update(this._schema.CART_ITEM).set(data)
        .where(eq(this._schema.CART_ITEM.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetCartItem> {
        
        const result = await this._db.delete(this._schema.CART_ITEM)
        .where(eq(this._schema.CART_ITEM.id, id)).returning()

        return result?.at(0) ?? null
    }
    async retrieve(id: string): Promise<GetCartItem>{
        
        const result = await this._db.query.CART_ITEM.findFirst({
            where: (crt_itm, {eq}) => eq(crt_itm.id, id)
        })

        return result ?? null
    }
    async list(query: SQL | null = null, start: number = 1 , size: number  = 10, columns?: Record<string | keyof CART_ITEM, boolean>, orderBy?: Column): Promise<Array<GetCartItem>>{
        
        const results = await this._db.query.CART_ITEM.findMany({
            where: query ?? undefined,
            orderBy,
            columns,
            offset: (start - 1) * size,
            limit: size
        })

        
        return results
    }
    
}


export default CartItem