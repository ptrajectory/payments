import db from "db"
import React, { Suspense } from 'react'
import ProductsTable from './table'
import { PRODUCT } from "db/schema"
import { eq } from "db/utils"
import CreateProductForm from "./components/create-product-form"
import ProductsServerTableWrapper from "./components/server-table-wrapper"
import { SkeletonBlock } from "@/layouts/skeletons"


async function page(props: { params: { store_id: string} }) {
    const { params: { store_id } } = props 


  return (
    <div className="flex flex-col w-full h-full space-y-5 pb-[200px]">

            <div className="flex flex-row w-full items-center justify-between">
                <span className="font-semibold text-xl">
                    Products
                </span>

               <CreateProductForm/>

            </div>
            

            <Suspense
                fallback={<SkeletonBlock
                    className="w-full h-[40vh]"
                />}
            >
                <ProductsServerTableWrapper
                    store_id={store_id ?? ''}
                />
            </Suspense>

        </div>
  )
}

export default page