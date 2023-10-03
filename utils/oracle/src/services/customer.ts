import { CUSTOMER, customer } from "zodiac";
import { IService } from "../../lib/services";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "db";
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";



type CreateCustomer = Omit<NonNullable<CUSTOMER>, "id" | "created_at" | "updated_at" | "status">
type UpdateCustomer = Omit<NonNullable<CUSTOMER>, "id" | "created_at" | "updated_at">
type GetCustomer = CUSTOMER & {
    created_at?: Date | null
    updated_at?: Date | null
}  | null


class Customer implements IService<CreateCustomer, UpdateCustomer, GetCustomer> {

    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreateCustomer){

        const data = parser<CreateCustomer>(customer, arg);

        const cus_id = generate_unique_id("cus")

        const result = await this._db.insert(this._schema.CUSTOMER).values({
            ...data,
            id: cus_id
        }).returning()

        return result?.at(0) ?? null
    }
    async update(id: string, arg: UpdateCustomer): Promise<GetCustomer>{

        const data = parser<UpdateCustomer>(customer, arg) 

        const result = await this._db.update(this._schema.CUSTOMER)
        .set(data)
        .where(eq(this._schema.CUSTOMER.id, id)).returning()

        return result?.at(0) ?? null
    }
    async delete(id: string): Promise<GetCustomer>{

        const result = await this._db.delete(this._schema.CUSTOMER)
        .where(eq(this._schema.CUSTOMER.id, id))
        .returning()
        
        
        return result?.at(0) ?? null

    }
    async retrieve(id: string): Promise<GetCustomer>{

        const result = await this._db.query.CUSTOMER.findFirst({
            where: (cus, {eq}) => eq(cus.id, id),
        })

        return result ?? null
    }
    async list(query: SQL | null = null, start: number =  1, size: number = 2, columns?: Record<string | keyof CUSTOMER, boolean> , orderBy?: Column): Promise<Array<GetCustomer>>{
        
        const results = await this._db.query.CUSTOMER.findMany({
            where: query ?? undefined,
            orderBy: orderBy, 
            columns,
            offset: (start -  1) * size,
            limit: size
        })
        
        return results
    }
    
}

export default Customer