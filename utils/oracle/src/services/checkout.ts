import { CHECKOUT, checkout } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";



type CreateCheckout = Omit<NonNullable<CHECKOUT>, "id"| "status" | "created_at" | "updated_at">

type UpdateCheckout = Omit<NonNullable<CHECKOUT>, "id"| "status" | "created_at" | "updated_at">

type GetCheckout = Omit<CHECKOUT, "created_at" | "updated_at"> & {
    created_at?: Date | null | string,
    updated_at?: Date | null | string
} | null


class Checkout implements IService {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreateCheckout): Promise<GetCheckout> {
        const data = parser<CreateCheckout>(checkout, arg);

        const result = await this._db.insert(this._schema.CHECKOUT).values({
            ...data,
            id: generate_unique_id("chk")
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdateCheckout): Promise<GetCheckout> {
        const data = parser<UpdateCheckout>(checkout, arg)

        const result = await this._db.update(this._schema.CHECKOUT).set(data)
        .where(eq(this._schema.CHECKOUT.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetCheckout> {
        const result = await this._db.delete(this._schema.CHECKOUT)
        .where(eq(this._schema.CHECKOUT.id, id)).returning()

        return result?.at(0) ?? null
    }
    async retrieve(id: string): Promise<GetCheckout>{
        const result = await this._db.query.CHECKOUT.findFirst({
            where: (chk, {eq}) => eq(chk.id, id)
        })

        return result ?? null
    }
    async list(query: SQL | null = null, start: number = 1 , size: number  = 10, columns?: Record<string | keyof CHECKOUT, boolean>, orderBy?: Column): Promise<Array<GetCheckout>>{
        const results = await this._db.query.CHECKOUT.findMany({
            where: query ?? undefined,
            orderBy,
            columns,
            offset: (start - 1) * size,
            limit: size
        })

        
        return results
    }
    
}


export default Checkout