import { PAYMENT, payment } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";



type CreatePayment = Omit<NonNullable<PAYMENT>, "id"| "status">

type UpdatePayment = Omit<NonNullable<PAYMENT>, "id"| "status">

type GetPayment = PAYMENT | null


class Payment implements IService {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreatePayment): Promise<GetPayment> {
        const data = parser<CreatePayment>(payment, arg);

        const result = await this._db.insert(this._schema.PAYMENT).values({
            ...data,
            id: generate_unique_id("pay")
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdatePayment): Promise<GetPayment> {
        const data = parser<UpdatePayment>(payment, arg)

        const result = await this._db.update(this._schema.PAYMENT).set(data)
        .where(eq(this._schema.PAYMENT.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetPayment> {
        const result = await this._db.delete(this._schema.PAYMENT)
        .where(eq(this._schema.PAYMENT.id, id)).returning()

        return result?.at(0) ?? null
    }
    async retrieve(id: string): Promise<GetPayment>{
        const result = await this._db.query.PAYMENT.findFirst({
            where: (pay, {eq}) => eq(pay.id, id)
        })

        return result ?? null
    }
    async list(query: SQL | null = null, start: number = 1 , size: number  = 10, columns?: Record<string | keyof PAYMENT, boolean>, orderBy?: Column): Promise<Array<GetPayment>>{
        const results = await this._db.query.PAYMENT.findMany({
            where: query ?? undefined,
            orderBy,
            columns,
            offset: (start - 1) * size,
            limit: size
        })

        
        return results
    }
    
}


export default Payment