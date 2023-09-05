import db from "db"
import React from 'react'
import ProductsTable from './table'
import { PRODUCT } from "db/schema"
import { eq } from "db/utils"


const getProducts = async (store_id: string) => {

    try {
        const result = await fetch(`/api/products/store_id${store_id}`)

        const products = db.query.PRODUCT.findMany({
            where: eq(PRODUCT.store_id, store_id),
            orderBy: PRODUCT.created_at,
            columns: {
                id: true,
                name: true,
                image: true,
                description: true,
                price: true,
                store_id: true
            }
        })

        return products
    }
    catch (e)
    {
    
        // TODO: deal with the error
        return []
    }

}

async function page(props: { params: { store_id: string} }) {
    const { params: { store_id } } = props 

    const products = await getProducts(store_id)

    

  return (
    <ProductsTable
        products={products}
    />
  )
}

export default page