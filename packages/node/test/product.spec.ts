import assert from "assert";
import Payments from "../src/index.ts";
import { isNull } from "../src/lib/cjs/lodash.ts";

const payments = new Payments("")
let product_id: string | null = null
const camera_image = "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

describe("PRODUCTS", ()=>{

    describe("BASIC CRUD", ()=>{
        it("Create Product", (done)=>{
    
            payments.product?.createProduct({
                name: "camera",
                image: camera_image,
                description: "Black Nikon camera",
                price: 455.99
            }).then((product)=>{
                console.log("PRODUCT", product)
                assert.match((product.id ?? ""), /pro/)
                product_id = product?.id ?? null
                done()
            })
            .catch((e)=>{
                console.error("ERROR", e)
                done(e)
            })
    
        })
    
        it("Get Product", (done)=>{
    
            if (isNull(product_id) ) return done(Error("PRODUCT ID IS EMPTY"))
    
            payments.product?.getProduct(product_id)
            .then((product)=>{
                console.log("PRODUCT", product)
                assert.strictEqual(product.id, product_id)
                done()
            })
            .catch((e)=>{
                console.error("ERROR", e)
                done(e)
            })
    
        })
    
        it("Update Product", (done)=>{
    
            if (isNull(product_id) ) return done(Error("PRODUCT ID IS EMPTY"))
    
            payments.product?.updateProduct(product_id, {
                price: 399.00
            }).then((product)=>{
                console.log("PRODUCT", product)
                assert.strictEqual(product.id, product_id)
                assert.strictEqual(product.price, 399.00)
                done()
            })
            .catch((e)=>{
                console.error("ERROR", e)
                done(e)
            })
    
    
        })
    
        it("Delete Product", (done)=>{
            if (isNull(product_id) ) return done(Error("PRODUCT ID IS EMPTY"))
    
            payments.product?.deleteProduct(product_id).then((product)=>{
                console.log("PRODUCT", product)
                assert.strictEqual(product.id, product_id)
                done()
            })
            .catch((e)=>{
                console.error("ERROR", e)
                done(e)
            })
        })

    })


})

