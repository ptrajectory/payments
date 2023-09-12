import React from 'react'
import * as Form from "@radix-ui/react-form"
import { Input } from '@/components/atoms/input'
import { isEmpty } from 'lodash'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { Button } from '@/components/atoms/button'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useParams } from 'next/navigation'

function CreatePaymentMethod() {

    const { customer_id, store_id } = useParams()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        let data =  Object.fromEntries(new FormData(e.currentTarget))
        e.preventDefault()

        try {
            const payment_method = await axios.post("/api/payment_methods", {
                ...data,
                customer_id,
                store_id
            })

            console.log(payment_method)

        }
        catch (e)
        {
            // TODO: error toast
        }

    }

    return (
        <Form.Root
        className='flex flex-col items-start justify-start w-full'
        onSubmit={handleSubmit}
        >
        <div className="flex flex-row items-center justify-between space-x-4 w-full">

            {/* left */}

            <div className="flex flex-col items-center justify-start w-1/2 space-y-2 ">

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
                <Form.Message className='text-red text-sm font-medium' match={(val)=>isEmpty(val)} >
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
                <Form.Message className='text-red text-sm font-medium' match={(val)=>isEmpty(val)} >
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
                Submit
            </Button>
            </Form.Submit>
        </div>
        </Form.Root>
    )
}

export default CreatePaymentMethod