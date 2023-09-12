"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog"
import CreateStore from "@/components/organisms/store-forms/store-form"
import { PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"



export default function AddStoreButton(props: any){
    return (
        <Link href="/dashboard/store" legacyBehavior >
            <div className="flex flex-col items-center cursor-pointer justify-center rounded-lg border-2  border-gray-200 p-5 hover:shadow-md">
                <PlusIcon/>
                <span className="font-medium text-sm">
                    Add Store
                </span>
            </div>
        </Link>
    )
}