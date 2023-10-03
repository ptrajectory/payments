import { IService } from "../../lib/services";
import db, { schema } from "db"
import { PRODUCT, product, PRODUCT as tPRODUCT } from "zodiac"
import { parser } from "../../lib/parser";
import { generate_unique_id } from "generators";
import { Column, SQL, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type CreateProductDTO = Omit<NonNullable<tPRODUCT>, "id" | "status">
type UpdateProductDTO = NonNullable<Omit<tPRODUCT, "id">>
type GetProduct = Partial<tPRODUCT> & {
    updated_at?: Date | null,
    created_at?: Date | null
}

class Product implements IService<CreateProductDTO, UpdateProductDTO, GetProduct> {
    
    private readonly _db: PostgresJsDatabase<typeof schema>
    private readonly _schema: typeof schema

    constructor(db: PostgresJsDatabase<any>, schema: any){
        this._db = db
        this._schema = schema
    }

    async create(arg: CreateProductDTO){
        const data = parser<PRODUCT>(arg, product) // error should be handled by caller

        const product_id = generate_unique_id("pro")
        const result = await this._db.insert(this._schema.PRODUCT).values({
            ...data,
            id: product_id
        }).returning()

        let resp =  result.at(0)

        return resp ?? null
    }

    async update(id: string, arg: UpdateProductDTO){

        const data = parser<NonNullable<UpdateProductDTO>>(arg, product)
        
        const result = await this._db.update(this._schema.PRODUCT)
        .set(data)
        .where(eq(this._schema.PRODUCT.id, id))
        .returning()

        let resp = result.at(0)

        return resp ?? null
    }

    
    async delete(id: string){

        const result = await this._db.delete(this._schema.PRODUCT)
        .where(eq(this._schema.PRODUCT.id, id)).returning()

        return result.at(0) ?? null
    }


    async retrieve(id: string){

        const result = await this._db.query.PRODUCT.findFirst({
            where: (prod, {eq})=> eq(prod.id, id)
        })

        return result ?? null
    }


    async list(query: SQL | null = null, page: number = 1, size: number = 10, columns?: Record<keyof tPRODUCT | string, boolean>,  orderBy?: Column<any>){

        const results = await this._db.query.PRODUCT.findMany({
            where: query ?? undefined,
            columns,
            orderBy,
            offset: (page - 1) * size,
            limit: size,
        })

        return results
    }


    

}


export default Product;