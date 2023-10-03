import { KEYS, keys } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, Update, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";



type CreateKeys = Omit<NonNullable<KEYS>, "id"| "status">

type UpdateKeys = Omit<NonNullable<KEYS>, "id"| "status">

type GetKeys = KEYS | null


class Keys implements IService {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreateKeys): Promise<GetKeys> {
        const data = parser<CreateKeys>(keys, arg);

        const result = await this._db.insert(this._schema.KEYS).values({
            ...data,
            id: generate_unique_id("ky")
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdateKeys): Promise<GetKeys> {
        const data = parser<UpdateKeys>(keys, arg)

        const result = await this._db.update(this._schema.KEYS).set(data)
        .where(eq(this._schema.KEYS.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetKeys> {
        const result = await this._db.delete(this._schema.KEYS)
        .where(eq(this._schema.KEYS.id, id)).returning()

        return result?.at(0) ?? null
    }
    async retrieve(id: string): Promise<GetKeys>{
        const result = await this._db.query.KEYS.findFirst({
            where: (ky, {eq}) => eq(ky.id, id)
        })

        return result ?? null
    }
    async list(query: SQL | null = null, start: number = 1 , size: number  = 10, columns?: Record<string | keyof KEYS, boolean>, orderBy?: Column): Promise<Array<GetKeys>>{
        const results = await this._db.query.KEYS.findMany({
            where: query ?? undefined,
            orderBy,
            columns,
            offset: (start - 1) * size,
            limit: size
        })

        
        return results
    }
    
}


export default Keys