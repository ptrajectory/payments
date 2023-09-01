import DashboardTopBar from "@/components/organisms/dashboard-topbar";
import { PageLayoutProps } from "@/lib/types";
import { getAuth } from "@clerk/nextjs/server";
import { PlusIcon, ShirtIcon, User } from "lucide-react";
import { GetServerSideProps } from "next";
import { SELLER as tSELLER, STORE as tSTORE } from "zodiac";
import db from "db"
import { eq, sql } from "db/utils";
import { CUSTOMER, PRODUCT, SELLER, STORE } from "db/schema";
import { isEmpty } from "lodash";
import Upload from "@/components/atoms/upload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog";
import CreateStore from "@/components/organisms/store-forms/store-form";
import Link from "next/link";



export default function DashboardPage (props: {
    stores: Array<tSTORE & {
        customers: number 
        products: number
    }> | null
}) {
    const { stores } = props
    console.log(stores)
    return (
            <div className="w-full h-full flex flex-col items-center justify-start">
                <div className="flex flex-col items-center justify-start w-4/5 space-y-5">


                    <div className="flex flex-row items-center justify-start w-full">
                        <h1 className="text-3xl font-medium" >
                            Stores
                        </h1>
                    </div>

                    <div className="grid grid-cols-3 gap-x-5 gap-y-5 w-full h-full">

                        <Dialog modal>
                            <DialogTrigger asChild>
                                <div className="flex flex-col items-center cursor-pointer justify-center rounded-lg border-2  border-gray-200 p-5 hover:shadow-md">
                                    <PlusIcon/>
                                    <span className="font-medium text-sm">
                                        Add Store
                                    </span>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Create Store
                                    </DialogTitle>
                                </DialogHeader>
                                <CreateStore/>
                            </DialogContent>
                        </Dialog>


                        {
                            stores?.map((store, i)=>{
                                return (
                                    <Link key={i} legacyBehavior href={`/dashboard/${store.id}`} >
                                        <div className="flex flex-col items-center cursor-pointer justify-start rounded-lg border-2 overflow-hidden  border-gray-200 hover:shadow-md">

                                            <div className="flex flex-row items-center justify-center w-full p-5 bg-blue-600 ">
                                                <span className="text-white font-medium" >
                                                    {store?.name}
                                                </span>
                                            </div>
                                            <div className="flex flex-col w-full items-start space-y-2 px-5 py-4">
                                                <div className="flex flex-row items-end justify-start gap-x-4">
                                                    <User className="text-xs" />
                                                    <span>
                                                        {store?.customers} customers
                                                    </span>
                                                </div>
                                                <div className="flex flex-row items-end justify-start gap-x-4">
                                                    <ShirtIcon className="text-xs" />
                                                    <span>
                                                        {store?.products} products
                                                    </span>
                                                </div>


                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>


                </div>
            </div>
    )
}


export const getServerSideProps: GetServerSideProps<PageLayoutProps & {
    stores?: Array<tSTORE> | null
}> = async (context) => {

    const auth = getAuth(context.req)

    let stores: Array<tSTORE> | null | undefined = null 
    let error: null | string = null
    let seller: null | tSELLER | undefined = null

    try {

        seller = await db.query.SELLER.findFirst({
            where: eq(SELLER.uid, auth?.userId)
        })

        console.log("SELLER", JSON.stringify(seller))

        stores = await db.select({
            id: STORE.id,
            name: STORE.name,
            customers: sql<number>`count(distinct ${CUSTOMER.id})`.mapWith(Number),
            products: sql<number>`count(distinct ${PRODUCT.id})`.mapWith(Number)
        }).from(STORE)
        .where(eq(STORE.seller_id, seller?.id))
        .innerJoin(PRODUCT, eq(PRODUCT.store_id, STORE.id))
        .innerJoin(CUSTOMER, eq(CUSTOMER.store_id, STORE.id))
        .groupBy(STORE.id)


        console.log("THE SRTORES", stores)

        // console.log("STORES::", JSON.stringify(stores, (k, v)=> {
        //     if(v instanceof Date) return v.toISOString()
        //     return v
        // }))


    }
    catch (e)
    {
        console.log("ERROR::",e)
        error = "SOMETHING WENT WRONG"
    }

    if (!isEmpty(error)) {
        return {
            props: {
                layout: "dashboard",
                hide_sidebar: true
            }
        }
    }

    return {
        props: {
            layout: "dashboard",
            hide_sidebar: true,
            stores: JSON.parse(JSON.stringify(stores, (k, v)=> {
                if(v instanceof Date) return v.toISOString()
                return v
            }))
        }
    }
}