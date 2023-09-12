import db from "db"
import { auth } from "@clerk/nextjs"
import { isNull } from "lodash"
import { STORE as tSTORE, store } from "zodiac"
import { stringifyDatesInJSON } from "@/lib/utils"
import { MainDashboardPage } from "./_page"
import { CUSTOMER, PRODUCT, SELLER, STORE } from "db/schema"
import { eq, sql } from "db/utils"
import AddStoreButton from "./components/add-store-button"
import { Suspense } from "react"
import StoreCard from "./components/store-card"
import { SkeletonBlock } from "@/layouts/skeletons"






const getStores = async () => {

    const { userId } = auth()

    if(isNull(userId)) return null;

    try {

        const store_ids = await db.select({
            id: STORE.id
        }).from(STORE)
        .innerJoin(SELLER, eq(SELLER.id, STORE.seller_id))
        .where(eq(SELLER.uid, userId))
        .groupBy(STORE.id)


        return store_ids?.map(({id})=>id) ?? null

    }
    catch (e)
    {
        // TODO: handle error later
        return null 
    }
    

}


export default async function Page(){


    const data = await getStores()


    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
                <div className="flex flex-col items-center justify-start w-4/5 space-y-5">


                    <div className="flex flex-row items-center justify-start w-full">
                        <h1 className="text-3xl font-medium" >
                            Stores
                        </h1>
                    </div>

                    <div className="grid grid-cols-3 gap-x-5 gap-y-5 w-full h-full">

                        <AddStoreButton/>
                        {
                            data?.map((store, i)=>{
                                return (
                                    <Suspense key={i} fallback={<SkeletonBlock
                                        className="w-[400px] h-[150px]"
                                    />} >
                                        <StoreCard
                                            id={store ?? ""}
                                        />
                                    </Suspense>
                                )
                            })
                        }
                    </div>


                </div>
        </div>
    )

}