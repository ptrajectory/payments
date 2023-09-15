import assert from "assert";
import { PaymentsClientHttpError, createPaymentClient } from "../src";
import { isNull } from "../src/lib/cjs/lodash";
import db from "db";
import { PRODUCT } from "db/schema";
import { eq } from "db/utils";


const client = createPaymentClient(process.env.URL as string, process.env.SECRET_KEY  as string)


let product_id: string | null = null

describe("PRODUCTS", ()=> {


    it("CREATE PRDUCT", (done)=>{


        client.products.create({
            description: "Cool Product description",
            image: "NO IMAGE",
            name: "Product 1",
            price: 3000
        })
        .then((product)=>{

            assert.strictEqual(product?.name, "Product 1")

            product_id = product.id ?? null
            done()

        })
        .catch((e)=>{

            if(e instanceof PaymentsClientHttpError){
                console.log("Server error::", e.code)
            }

            done(e)

        })


    })


    it("GET PRODUCT", (done)=> {

        if(isNull(product_id)) return done(new Error("PRODUCT ID EMPTY"))
        
        client.products.retrieve(product_id)
        .then((product)=>{
            assert.strictEqual(product?.id, product_id)
            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server error::", e.code)
            }

            done(e)
        })

    })


    it("Update Product", (done)=>{

        if(isNull(product_id)) return done(new Error("PRODUCT ID EMPTY"))

        client.products.update(product_id, {
            image: "NO NEW IMAGE"
        }).then((product)=> {
            assert.strictEqual(product?.id, product_id)
            assert.strictEqual(product?.image, "NO NEW IMAGE")
            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server error::", e.code)
            }

            done(e)
        })

    })

    it("Archive Product", (done)=>{

        if(isNull(product_id)) return done(new Error("PRODUCT ID EMPTY"))

        client.products.archive(product_id) 
        .then((product)=>{
            assert.strictEqual(product?.id, product_id)
            assert.strictEqual(product?.status, "ARCHIVED")
            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server error::", e.code)
            }

            done(e)
        })

    })


    after(async ()=>{

        // product_id && await db.delete(PRODUCT)
        // .where(eq(PRODUCT.id, product_id))

    })

})