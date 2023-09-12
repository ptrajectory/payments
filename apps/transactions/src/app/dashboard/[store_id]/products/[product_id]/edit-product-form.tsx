"use client"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/atoms/sheet"
import { TextArea } from "@/components/atoms/textarea"
import Upload from "@/components/atoms/upload"
import * as Form from "@radix-ui/react-form"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Ref, useRef, useState } from "react"
import { PRODUCT as tPRODUCT } from "zodiac"




interface EditProductProps {
    data: tPRODUCT | null
}

export default function EditProductForm(props: EditProductProps){
    const { data } = props
    const [image, setImage ] = useState<string>()

    const { refresh } = useRouter()

    const close_button_ref = useRef<any>(null)

    const params = useParams()

    const store_id = params.store_id

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        let data =  Object.fromEntries(new FormData(e.currentTarget))
        e.preventDefault()

        try {

            const result = (await axios.put(`/api/products/${params.product_id}`, {
                ...data,
                store_id,
                image,
                price: Number(data.price)
            })).data

            close_button_ref?.current?.click()

            refresh()

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
                    Edit your Product
                </Button>
            </SheetTrigger>
            <SheetContent
                side="bottom"
            >
                <SheetHeader>
                    <SheetTitle>
                        Edit Product
                    </SheetTitle>
                    <SheetDescription>
                        Update Product details
                    </SheetDescription>
                    
                </SheetHeader>
                <div className="w-full flex flex-col items-center justify-start py-5">


                <Form.Root
                    className='flex flex-col items-start justify-start w-full'
                      onSubmit={handleSubmit}
                    >
                    <div className="flex flex-col items-center justify-between space-y-1 w-full">
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

                            <span className="text-sm" >
                                A unique product image, which will be shown on checkout.
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
                                Product Name
                            </Form.Label>
                            <Form.Control required asChild>
                                <Input
                                defaultValue={data?.name}
                                placeholder='Product Name (Required)'
                                />
                            </Form.Control>
                            <span className="text-sm" >
                                A unique name for your product, this will be displayed to your customers during checkout and be included in your invoices.
                            </span>
                            <Form.Message className="text-sm text-red-500 " match="valueMissing" >
                                    A Product Name is Required!!
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
                                placeholder='Describe the product (Required)'
                                />
                            </Form.Control>
                            <span className="text-sm" >
                                Describe this product
                            </span>
                            <Form.Message className="text-sm text-red-500 " match="valueMissing" >
                                    Giving your store a description is important!!
                            </Form.Message>
                            </div>
                        </Form.Field>


                        <Form.Field
                            name="price"
                            className='w-full'
                            aria-required
                        >
                            <div className="flex flex-col">
                            <Form.Label>
                                Price 
                            </Form.Label>
                            <Form.Control required asChild>
                                <Input
                                defaultValue={data?.price}
                                type="number"
                                placeholder='Price (Required)'
                                />
                            </Form.Control>
                            <span className="text-sm my-2" >
                                Give a price to your product
                            </span>
                            <Form.Message className="text-sm text-red-500 " match="valueMissing" >
                                    A Price is required!!
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