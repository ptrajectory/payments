import { CART, cart } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";



type CreateCart = Omit<CART, "id" | "status">

type UpdateCart = Omit<CART, "id" | "store_id">

type GetCart = CART & {
    created_at?: Date | null,
    updated_at?: Date | null
}| null



class Cart implements IService {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreateCart): Promise<GetCart> {

        const data = parser<CreateCart>(cart, arg);

        const result = await this._db.insert(this._schema.CART).values({
            ...data,
            id: generate_unique_id("crt")
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdateCart): Promise<GetCart>{
        const data = parser<UpdateCart>(cart, arg)

        const result = await this._db.update(this._schema.CART_ITEM).set(data)
        .where(eq(this._schema.CART.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetCart> {
        const result = await this._db.delete(this._schema.CART)
        .where(eq(this._schema.CART.id, id)).returning()

        return result?.at(0) ?? null
    }
    async retrieve(id: string): Promise<GetCart> {
        const result = await this._db.query.CART.findFirst({
            where: (crt, {eq}) => eq(crt.id, id)
        })

        return result ?? null
    }
    async list(query: SQL | null, start: number = 1 , size: number = 10 , columns: Record<string | keyof CART, boolean> | undefined, orderBy?: Column): Promise<Array<GetCart>>{
        const results = await this._db.query.CART.findMany({
            where: query ?? undefined,
            orderBy,
            columns,
            offset: (start - 1) * size,
            limit: size
        })

        
        return results
    }
    
}

export default Cart