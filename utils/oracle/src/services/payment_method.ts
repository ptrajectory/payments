import { PAYMENT_METHOD, payment, payment_method } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";


type CreatePaymentMethod = Omit<NonNullable<PAYMENT_METHOD>, "id" | "created_at" | "updated_at">

type UpdatePaymentMethod = Omit<NonNullable<PAYMENT_METHOD>, "id" | "customer_id" | "store_id" | "created_at" | "updated_at">

type GetPaymentMethod = PAYMENT_METHOD | null


class PaymentMethod implements IService<CreatePaymentMethod, UpdatePaymentMethod, GetPaymentMethod> {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema:any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreatePaymentMethod): Promise<GetPaymentMethod>{
        const data = parser<CreatePaymentMethod>(payment_method, arg);

        const result = await this._db.insert(this._schema.PAYMENT_METHOD).values({
            ...data,
            id: generate_unique_id("pm")
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdatePaymentMethod): Promise<GetPaymentMethod>{
        const data = parser<UpdatePaymentMethod>(payment_method, arg)

        const result = await this._db.update(this._schema.PAYMENT_METHOD).set(data)
        .where(eq(this._schema.PAYMENT_METHOD.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetPaymentMethod>{
        const result = await this._db.delete(this._schema.PAYMENT_METHOD)
        .where(eq(this._schema.PAYMENT_METHOD.id, id)).returning()

        return result?.at(0) ?? null
    }
    async retrieve(id: string): Promise<GetPaymentMethod>{
        const result = await this._db.query.PAYMENT_METHOD.findFirst({
            where: (pm, {eq}) => eq(pm.id, id)
        })

        return result ?? null
    }
    async list(query: SQL | null, start: number = 1, size: number = 10, columns?: Record<string | keyof PAYMENT_METHOD, boolean> , orderBy?: Column):Promise<Array<GetPaymentMethod>>{
        const results = await this._db.query.PAYMENT_METHOD.findMany({
            where: query ?? undefined,
            orderBy,
            columns,
            offset: (start - 1) * size,
            limit: size
        })

        
        return results
    }
    
}

export default PaymentMethod 