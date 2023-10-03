import { STORE, store } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";



type CreateStore = Omit<NonNullable<STORE>, "id"| "status">

type UpdateStore = Omit<NonNullable<STORE>, "id"| "status">

type GetStore = STORE | null


class Store implements IService {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreateStore): Promise<GetStore> {
        const data = parser<CreateStore>(store, arg);

        const result = await this._db.insert(this._schema.CART_ITEM).values({
            ...data,
            id: generate_unique_id("str")
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdateStore): Promise<GetStore> {
        const data = parser<UpdateStore>(store, arg)

        const result = await this._db.update(this._schema.STORE).set(data)
        .where(eq(this._schema.STORE.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetStore> {
        const result = await this._db.delete(this._schema.STORE)
        .where(eq(this._schema.STORE.id, id)).returning()

        return result?.at(0) ?? null
    }
    async retrieve(id: string): Promise<GetStore>{
        const result = await this._db.query.STORE.findFirst({
            where: (str, {eq}) => eq(str.id, id)
        })

        return result ?? null
    }
    async list(query: SQL | null = null, start: number = 1 , size: number  = 10, columns?: Record<string | keyof STORE, boolean>, orderBy?: Column): Promise<Array<GetStore>>{
        const results = await this._db.query.STORE.findMany({
            where: query ?? undefined,
            orderBy,
            columns,
            offset: (start - 1) * size,
            limit: size
        })

        
        return results
    }
    
}


export default Store