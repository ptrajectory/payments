"use client"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/atoms/sheet"
import * as Form from "@radix-ui/react-form"
import axios from "axios"
import { useParams } from "next/navigation"
import { Ref, useRef } from "react"




interface CreateCustomerProps {
    onClose: ()=>void
}


export default function CreateCustomerForm(props: CreateCustomerProps){

    const { onClose } = props

    const close_button_ref = useRef<any>(null)

    const params = useParams()

    const store_id = params.store_id

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        let data =  Object.fromEntries(new FormData(e.currentTarget))
        e.preventDefault()

        

        try {

            const result = (await axios.post("/api/customers", {
                ...data,
                store_id
            })).data

            close_button_ref?.current?.click()

            onClose()

        }
        catch (e)
        {
            console.log(e)
        }
    }


    return  (
        <Sheet >
            <SheetTrigger asChild>
                <Button>
                    Create Customer
                </Button>
            </SheetTrigger>
            <SheetContent
                side="bottom"
            >
                <SheetHeader>
                    <SheetTitle>
                        Create Customer
                    </SheetTitle>
                    <SheetDescription>
                        Add a new customer to the shop
                    </SheetDescription>
                </SheetHeader>
                <div className="w-full flex flex-col items-center justify-start py-5">


                <Form.Root
                    className='flex flex-col items-start justify-start w-full'
                      onSubmit={handleSubmit}
                    >
                    <div className="flex flex-col items-center justify-between space-y-4 w-full">


                        <div className="flex flex-row w-full items-center justify-between gap-x-3">
                            <Form.Field
                                className='w-full text-lg'
                                name="first_name"
                                
                            >
                                <div className="flex flex-col w-full" >
                                <Form.Label>
                                    First Name
                                </Form.Label>
                                <Form.Control asChild>
                                    <Input
                                    placeholder='First Name'
                                    />
                                </Form.Control>
                                </div>
                            </Form.Field>


                            <Form.Field
                                className='w-full text-lg'
                                name="last_name"
                                
                            >
                                <div className="flex flex-col w-full" >
                                <Form.Label>
                                    Last Name
                                </Form.Label>
                                <Form.Control asChild>
                                    <Input
                                    placeholder='Last Name'
                                    />
                                </Form.Control>
                                </div>
                            </Form.Field>

                        </div>

                        <Form.Field
                            className='w-full text-lg'
                            name="email"
                            aria-required

                        >
                            <div className="flex flex-col w-full" >
                            <Form.Label>
                                Email
                            </Form.Label>
                            <Form.Control required asChild>
                                <Input
                                placeholder='Email'
                                type="email"
                                />
                            </Form.Control>
                            <Form.Message className="text-sm text-red-500 " match="valueMissing" >
                                    Customer Email is required!!
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
                    
                <SheetClose
                    ref={close_button_ref}
                    className="hidden"
                />
                </div>
            </SheetContent>
        </Sheet>
    )
}