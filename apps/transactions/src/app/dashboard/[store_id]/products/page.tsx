import React from 'react'
import ProductsTable from './table'


const getProducts = async (store_id: string) => {

    try {
        const result = await fetch(`/api/products/store_id${store_id}`)

        const products = await (async ()=>{

            if(!result.ok) throw new Error("UNABLE TO GET PRODUCTS")

            return await result.json()
        })()

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