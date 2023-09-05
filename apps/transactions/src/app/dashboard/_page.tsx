"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog"
import CreateStore from "@/components/organisms/store-forms/store-form"
import { PlusIcon, ShirtIcon, User } from "lucide-react"
import Link from "next/link"
import { STORE } from "zodiac"


export function MainDashboardPage(props: { stores?: null | Array<STORE & { customers: number, products: number } > }) {

    const { stores } = props

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