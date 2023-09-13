"use client"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/atoms/sheet"
import { TextArea } from "@/components/atoms/textarea"
import Upload from "@/components/atoms/upload"
import { useToast } from "@/components/atoms/use-toast"
import * as Form from "@radix-ui/react-form"
import axios from "axios"
import { isNull } from "lodash"
import { CheckSquare, Clipboard, Link } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Ref, useRef, useState } from "react"
import { PRODUCT as tPRODUCT } from "zodiac"




interface Props {
    product_id: string
}

export default function GeneratePurchaseLink(props:Props){
    const [purchase_link, set_purchase_link] = useState("")
    const [copied, setCopied] = useState(false)
    const { product_id } = props
    const [isLoading, setLoading] = useState(false)
    const close_button_ref = useRef<any>(null)
    const [quantity, setQuantity ] = useState("1")
    const { toast } = useToast()
    

    const params = useParams()

    const store_id = params.store_id

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        e.preventDefault()

        try {

            console.log(quantity)
            const result = (await axios.post("/api/purchase_link", {
                store_id,
                product_id,
                quantity: Number.isInteger(Number(quantity)) ? Number(quantity) : 0
            })).data.data ?? null


            if(!isNull(result)){
                const origin = window.origin
                const url = `${origin}/checkout/${result.id}`

                set_purchase_link(url)
            }
            



        }
        catch (e)
        {
            toast({
                title: "Oops!",
                description: "Something went wrong. Try again.",
                variant: "destructive",
                duration: 3000
            })
        }
        finally
        {
            setLoading(false)
        }
    }


    const onCopy = () => {
        setCopied(true)
        navigator.clipboard.writeText(purchase_link ?? "Nothing copied")
        .then(()=>{
            close_button_ref?.current?.click()
        })
        .catch(()=>{
            // TODO: deal with error
        })
        .finally(()=>{
            setCopied(false)
        })
    }


    return  (
        <Sheet >
            <SheetTrigger asChild>
                <Button>
                    <Link
                        size="16px"
                        className="mr-3"
                    />
                    <span>
                        Purchase Link
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="bottom"
            >
                <SheetHeader>
                    <SheetTitle>
                        Generate Purchase Link
                    </SheetTitle>
                    <SheetDescription>
                        Create a one time purchase link for this product.
                    </SheetDescription>
                    
                </SheetHeader>
                <div className="w-full flex flex-col items-center justify-start py-5">

                {purchase_link && <div className="flex flex-row items-center space-x-2">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" >
                        { purchase_link }
                    </code>
                    <button
                        onClick={onCopy}
                    >   {
                        copied ? <CheckSquare size="20px" className="text-amber-500" /> : (
                            <Clipboard
                                size="20px"
                                className="text-slate-400 hover:text-black"
                            />
                        )
                    }
                    </button>
                </div>}

                <Form.Root
                    className='flex flex-col items-start justify-start w-full'
                      onSubmit={handleSubmit}
                    >
                    <div className="flex flex-col items-center justify-between space-y-1 w-full">
                        <Form.Field
                            className='w-full text-lg'
                            name="quantity"
                            aria-required
                            
                        >
                            <div className="flex flex-col w-full" >
                            <Form.Label>
                                Quantity
                            </Form.Label>
                                <Form.Control asChild >
                                    <Input
                                        value={quantity}
                                        onChange={(e)=> setQuantity(e.target.value)}
                                        placeholder="Product Quantity" 
                                        type="number"
                                        
                                    />
                                </Form.Control>
                      

                            <span className="text-sm" >
                                Number of products to be included in purchase.
                            </span>

                            </div>
                        </Form.Field>
            
                    </div>
                    <div className="flex flex-row w-full items-center justify-start py-5">
                        <Form.Submit asChild
                        >
                            <Button
                                isLoading={isLoading}
                                loadingText="Creating Purchase Link..."
                            >
                                
                                Create 
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