"use client"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/atoms/sheet"
import * as Form from "@radix-ui/react-form"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Ref, useRef } from "react"
import { CUSTOMER } from "zodiac"



interface Props {
    onClose: () => void
}

export default function AddPaymentMethodForm(props: Props ){
    const { onClose } = props

    const close_button_ref = useRef<any>(null)

    const params = useParams()

    const store_id = params.store_id

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        let data =  Object.fromEntries(new FormData(e.currentTarget))
        e.preventDefault()
        

        try {

            const result = (await axios.post(`/api/payment_methods`, {
                ...data,
                store_id,
                customer_id: params.customer_id
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
                    Add Payment Method
                </Button>
            </SheetTrigger>
            <SheetContent
                side="bottom"
            >
                <SheetHeader>
                    <SheetTitle>
                        Add a Payment Method
                    </SheetTitle>
                    <SheetDescription>
                        Add a Payment Method for this customer.
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
                            className='w-full'
                            name="phone_number"
                            aria-required
                        >
                            <div className="flex flex-col w-full">
                            <Form.Label>
                                Phone Number
                            </Form.Label>
                            <Form.Control asChild>
                                <Input
                                placeholder='Begin 254'
                                />
                            </Form.Control>
                            <Form.Message className='text-red text-sm font-medium' match={"valueMissing"} >
                                Phone Number is Required
                            </Form.Message>
                            </div>
                        </Form.Field>
                        <Form.Field
                            className='w-full'
                            name="type"
                            aria-required
                        >
                            <div className="flex flex-col w-full">
                            <Form.Label>
                                Provider
                            </Form.Label>
                            <Form.Control asChild>
                                <Select>
                                    <SelectTrigger  >
                                        <SelectValue placeholder="Select a Payment Provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='MPESA'> M-PESA </SelectItem>
                                        <SelectItem value='AIRTEL'>AIRTEL</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Form.Control>
                            <Form.Message className='text-red text-sm font-medium' match={"valueMissing"} >
                                Payment Provider is Required
                            </Form.Message>
                            </div>
                        </Form.Field>
                        </div>


                        
                    </div>
                    <div className="flex flex-row w-full items-center justify-start py-5">
                        <Form.Submit asChild
                        >
                            <Button>
                                Add
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