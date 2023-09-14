"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog"
import CreateStore from "@/components/organisms/store-forms/store-form"
import { PlusIcon, ShirtIcon, User } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { STORE } from "zodiac"
import StoreCard from "./components/store-card"
import AddStoreButton from "./components/add-store-button"


export function MainDashboardPage(props: { stores?: null | Array<string> }) {

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

                        <AddStoreButton/>


                        {
                            stores?.map((store, i)=>{
                                return (
                                    <Suspense key={i} fallback={<span>Loading...</span>} >
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