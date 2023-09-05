"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"


export default function Redirect(props: {checkout_id?: string}){

    const { checkout_id } = props 

    useEffect(()=>{
        redirect(`/checkout/${checkout_id}`)
    },[])

    return null

}