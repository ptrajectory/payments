"use server"
import Link from "next/link";
import db from "db";
import { CUSTOMER, PRODUCT, STORE } from "db/schema";
import { eq, sql } from "db/utils";
import { AppIcon } from "@/lib/icons";
import { Badge } from "@tremor/react";

interface StoreCardProps {
    id: string
}


async function getStoreData (id: string) {

    try {
        const result = await db.select({
            id: STORE.id,
            name: STORE.name,
            customers: sql<number>`count(distinct ${CUSTOMER.id})`.mapWith(Number),
            products: sql<number>`count(distinct ${PRODUCT.id})`.mapWith(Number),
            image: STORE.image,
            description: STORE.description,
            environment: STORE.environment
        })
        .from(STORE)
        .leftJoin(PRODUCT, eq(PRODUCT.store_id, STORE.id))
        .leftJoin(CUSTOMER, eq(CUSTOMER.store_id, STORE.id))
        .where(eq(STORE.id, id))
        .groupBy(STORE.id)


        const s =  result?.at(0) ?? null   

        return s
    }
    catch (e)
    {
        // TODO: deal with the erro

        return null

    }

}





export default async function StoreCard(props: StoreCardProps){

    const store = await getStoreData(props?.id)

    return (
        <Link legacyBehavior href={`/dashboard/${props?.id}`} >
            <div className="flex flex-col items-center cursor-pointer justify-start rounded-lg border-2 overflow-hidden  border-gray-200 hover:shadow-md">
                <div className="flex flex-row items-center justify-center w-full p-5 bg-blue-600 ">
                    <span className="text-white font-medium" >
                        {store?.name}
                    </span>
                </div>
                <div className="flex flex-col w-full items-start space-y-2 px-5 py-4">
                    <div className="flex flex-row items-end justify-start gap-x-4">
                        {/* <AppIcon name="User"  /> */}
                        <span>
                            {store?.customers} customers
                        </span>
                    </div>
                    <div className="flex flex-row items-end justify-start gap-x-4">
                        {/* <ShirtIcon className="text-xs" /> */}
                        <span>
                            {store?.products} products
                        </span>
                    </div>
                    <div className="flex flex-row items-center justify-start py-3">
                        <Badge size="lg" >
                            {
                                store?.environment?.toUpperCase()
                            }
                        </Badge>
                    </div>
                </div>
            </div>
        </Link>
    )

}