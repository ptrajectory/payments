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



export default function StoreCreateForm(){
    const [image, setImage ] = useState<string>()
    const { back, push } = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        let data =  Object.fromEntries(new FormData(e.currentTarget))
        e.preventDefault()
        console.log("Here is the data::", data)
    
    
        try {
            const result = (await axios.post("/api/stores", {
                ...data,
                image
            })).data
    
            push("/dashboard")
    
        }
        catch (e)
        {
            console.log(e)
        }
    
      }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">

            <div className="flex flex-col items-center justify-start shadow-sm rounded-md overflow-hidden w-1/2 ">

                <div className="relative flex flex-row p-4 w-full items-center justify-center">
                    <button onClick={()=>back()} className="absolute left-10 top-[50%] -translate-y-[50%] group cursor-pointer hover:bg-slate-100 p-2 rounded-full">
                        <ArrowLeft size="18px" className="" />
                    </button>
                    <span className="font-semibold text-2xl">
                        Create A New Store
                    </span>
                </div>

                <div className="flex flex-col w-full items-center justify-start px-5 py-4">


                <Form.Root
                    className='flex flex-col items-start justify-start w-full'
                      onSubmit={handleSubmit}
                    >
                    <div className="flex flex-col items-center justify-between space-y-4 w-full">
                        <Form.Field
                            className='w-full text-lg'
                            name="name"
                            aria-required
                            
                        >
                            <div className="flex flex-col w-full" >
                            <Form.Label>
                                Store Image
                            </Form.Label>
                            <div className="flex flex-col">
                                <Form.Control asChild >
                                    <Upload onChange={(new_image)=>{
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
                            Submit
                        </Button>
                        </Form.Submit>
                    </div>
                </Form.Root>


                </div>

            </div>

        </div>
    )

}


