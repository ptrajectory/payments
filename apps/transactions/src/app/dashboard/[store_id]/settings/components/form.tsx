"use client"

import { ArrowLeft } from "lucide-react"
import * as Form from "@radix-ui/react-form"
import { TextArea } from "@/components/atoms/textarea"
import { Input } from "@/components/atoms/input"
import { Button } from "@/components/atoms/button"
import Upload from "@/components/atoms/upload"
import { useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { STORE } from "zodiac"
import { Switch } from "@/components/atoms/switch"


interface StoreEditFormProps {
    data: STORE & { environment: "testing" | "production" } | null
}

export default function StoreEditForm(props: StoreEditFormProps){
    const { data } = props
    const [image, setImage ] = useState<string>()
    const { back, push, refresh } = useRouter()

    const { store_id } = useParams()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        let data =  Object.fromEntries(new FormData(e.currentTarget))
        e.preventDefault()
    
    
        try {
            const result = (await axios.put(`/api/stores/${store_id}`, {
                ...data,
                image
            })).data
    
            refresh()
    
        }
        catch (e)
        {
            console.log(e)
        }
    
      }
    
    const handleToggleEnvironment = async () => {
        try {
            const result = (await axios.put(`/api/stores/${store_id}`, {
                environment: data?.environment === "testing" ? "production" : "testing"
            })).data
    
            refresh()
    
        }
        catch (e)
        {
            console.log(e)
        }
    }

    const handleArchive = async () => {
        try {
            const result = (await axios.put(`/api/stores/${store_id}`, {
                status: "ARCHIVED"
            })).data
    
            refresh()
    
        }
        catch (e)
        {
            console.log(e)
        }
    }

    return (
        <div className="flex flex-col items-center justify-start shadow-sm rounded-md overflow-hidden w-full ">

                <div className="flex flex-col w-full items-center justify-start px-5 py-4">
                    <Form.Root
                        className='flex flex-col items-start justify-start w-full'
                        onSubmit={handleSubmit}
                        >
                        <div className="flex flex-col items-center justify-between space-y-4 w-full">
                            <Form.Field
                                className='w-full text-lg'
                                name="image"
                                aria-required
                                
                            >
                                <div className="flex flex-col w-full" >
                                <Form.Label>
                                    Store Image
                                </Form.Label>
                                <div className="flex flex-col">
                                    <Form.Control asChild >
                                        <Upload images={data?.image ? [data?.image] : []} onChange={(new_image)=>{
                                            setImage(new_image)
                                        }}/>
                                    </Form.Control>
                                </div>

                                <span className="text-sm my-2" >
                                    A unique store image, which will serve as a hero for any of your hosted pages.
                                </span>

                                </div>
                            </Form.Field>
                    

                            <Form.Field
                                className='w-full text-lg'
                                name="name"
                                aria-required
                                
                            >
                                <div className="flex flex-col w-full" >
                                <Form.Label>
                                    Store Name
                                </Form.Label>
                                <Form.Control required asChild>
                                    <Input
                                    defaultValue={data?.name}
                                    placeholder='Store Name (Required)'
                                    />
                                </Form.Control>
                                <span className="text-sm my-2" >
                                    A unique name for your store, this will be displayed to your customers during checkout and be included in your invoices.
                                </span>
                                <Form.Message className="text-sm text-red-500 " match="valueMissing" >
                                        A Store Name is Required!!
                                </Form.Message>

                                </div>
                            </Form.Field>


                            <Form.Field
                                name="description"
                                className='w-full'
                                aria-required
                            >
                                <div className="flex flex-col">
                                <Form.Label>
                                    Description
                                </Form.Label>
                                <Form.Control required asChild>
                                    <TextArea
                                    defaultValue={data?.description}
                                    className="h-[100px]"
                                    placeholder='Describe the store (Required)'
                                    />
                                </Form.Control>
                                <span className="text-sm my-2" >
                                    Describe what you sell, and give any information about your store. 
                                </span>
                                <Form.Message className="text-sm text-red-500 " match="valueMissing" >
                                        Giving your store a description is important!!
                                </Form.Message>
                                </div>
                            </Form.Field>
                        </div>
                        <div className="flex flex-row w-full items-center justify-start py-5">
                            <Form.Submit asChild
                            >
                            <Button>
                                Save Changes
                            </Button>
                            </Form.Submit>
                        </div>
                    </Form.Root>
                </div>
        
        <div className="flex flex-col w-full space-y-2">
           
           <span className="text-lg text-red-500">
                Danger Zone
           </span>

           <div className="flex flex-row items-center p-5 rounded-md border-[1px] border-red-400 justify-between w-full">

               <div className="flex flex-col space-y-1">
                    <span className="text-lg font-medium">
                        Enable Test Mode
                    </span>
                    <span className="text-sm text-slate-400" >
                        Test with confidence in test mode.
                    </span>
                    <Switch
                        onChange={()=>handleToggleEnvironment()}
                        defaultChecked={(data as any)?.environment === "testing"}
                    />
               </div>

               <div className="flex flex-col  space-y-1">
                    <span className="text-lg font-medium">
                        Archive Store
                    </span>
                    <span className="text-sm text-slate-400" >
                        Your store will not be available to your customers.
                    </span>
                    <Button
                        onClick={handleArchive}
                        variant={"destructive"}
                    >
                        Archive
                    </Button>
               </div>

           </div>
            
        </div>
            </div>   
    )

}


