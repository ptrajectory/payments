import { SELLER, seller } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";



type CreateSeller = Omit<NonNullable<SELLER>, "id"| "status" | "uid">

type UpdateSeller = Omit<NonNullable<SELLER>, "id"| "status" | "uid">

type GetSeller = SELLER | null


class Seller implements IService {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreateSeller): Promise<GetSeller> {
        const data = parser<CreateSeller>(seller, arg);

        const result = await this._db.insert(this._schema.SELLER).values({
            ...data,
            id: generate_unique_id("sll")
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdateSeller): Promise<GetSeller> {
        const data = parser<UpdateSeller>(seller, arg)

        const result = await this._db.update(this._schema.SELLER).set(data)
        .where(eq(this._schema.SELLER.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetSeller> {
        const result = await this._db.delete(this._schema.SELLER)
        .where(eq(this._schema.SELLER.id, id)).returning()

        return result?.at(0) ?? null
    }
    async retrieve(id: string): Promise<GetSeller>{
        const result = await this._db.query.SELLER.findFirst({
            where: (sll, {eq}) => eq(sll.id, id)
        })

        return result ?? null
    }
    async list(query: SQL | null = null, start: number = 1 , size: number  = 10, columns?: Record<string | keyof SELLER, boolean>, orderBy?: Column): Promise<Array<GetSeller>>{
        const results = await this._db.query.SELLER.findMany({
            where: query ?? undefined,
            orderBy,
            columns,
            offset: (start - 1) * size,
            limit: size
        })

        
        return results
    }
}


export default Seller