import { Separator } from "@/components/atoms/separator"
import db from "db"
import { Suspense } from "react"
import PaymentFormServerWrapper from "./components/payment-form-server-wrapper"
import { SkeletonBlock } from "@/layouts/skeletons"
import Image from "next/image"


interface PageProps {
    params: {
        checkout_id: string
    }
}

const getStoreDetails = async (checkout_id: string) => {


    try {
        const checkout = (await db.query.CHECKOUT.findFirst({
            where: (chk, { eq}) => eq(chk.id, checkout_id),
            columns: {
                environment: true,
                id: true,
                cart_id: true,
                customer_id: true
            },
            with: {
                store: {
                    columns: {
                        id: true,
                        environment: true,
                        name: true,
                        image: true,
                        description: true
                    }
                },
                cart: {
                    with: {
                        items: {
                            columns: {
                                product_id: true,
                                quantity: true
                            },
                            with: {
                                product: {
                                    columns: {
                                        name: true,
                                        image: true,
                                        price: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })) ?? null 

        
        return checkout ?? null as any

    }
    catch (e)
    {
        // TODO: deal with this better
        return null
    }

}

export default async function Page(props: PageProps) {
    const { params: { checkout_id } } = props

    const checkout = await getStoreDetails(checkout_id)




    return (
        <div className="flex flex-col w-screen h-screen">
            <div className="flex flex-row items-center justify-start p-5">
                <h1 className="text-2xl font-semibold">
                    Pay {" "}
                    {
                        checkout?.store?.name
                    }
                </h1>
            </div>
            <Separator className="w-full" />
            <div className="flex flex-row w-full h-full">

                    <div className="flex flex-col w-1/2 h-full items-center justify-center">

                        <Suspense
                            fallback={<SkeletonBlock className="w-4/5 h-4/5" />}
                        >
                            <PaymentFormServerWrapper
                                id={checkout_id}
                            />
                        </Suspense>

                    </div>  

                    <div className="flex flex-col h-full w-1/2 items-center justify-start p-10 bg-[#E3E3E3] ">

                        {
                            checkout?.cart?.items?.map((item: any, i: any)=>{

                                return (
                                    <div key={i} className="flex flex-row items-center justify-start w-full p-3 rounded-md gap-x-5 bg-[#d3dbe6]">
                                        
                                        <div className="flex flex-row items-center relative w-20 h-20 rounded-md overflow-hidden">
                                            <Image
                                                alt="product image"
                                                src={item?.product?.image ?? "/brand/placeholder_image.png"}
                                                fill 
                                                style={{
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </div>
                                            <div className="flex flex-col items-start justify-center gap-y-3 w-full">
                                                <h1 className="text-2xl font-medium">
                                                    {
                                                        item?.product?.name
                                                    }
                                                </h1>
                                                <div className="flex flex-row items-center justify-between w-full ">
                                                    <span>
                                                        {
                                                            `KES ${item?.product?.price ?? 0}`
                                                        }
                                                    </span>
                                                    <span className="font-medium" >
                                                        X {item?.quantity}
                                                    </span>
                                                </div>
                                            </div>

                                        

                                    </div>
                                )

                            })
                        }

                        <div className="flex flex-col w-full items-center justify-start space-y-5 mt-5">

                            <div className="flex flex-row items-center justify-between w-full">

                                <span className="text-1xl font-medium">
                                    Subtotal
                                </span>

                                <span className="text-1xl font-medium">
                                KES {" "} {
                                        checkout?.cart?.items?.reduce((prev: number, curr: any) =>{
                                            return prev + ((curr?.quantity * curr?.product?.price) ?? 0)
                                        },0)
                                    }
                                </span>

                            </div>


                            <div className="flex flex-row items-center justify-between w-full">

                                <span className="text-2xl font-medium">
                                    Total
                                </span>

                                <span className="text-2xl font-medium">
                                    KES {" "} {
                                        checkout?.cart?.items?.reduce((prev: number, curr: any) =>{
                                            return prev + ((curr?.quantity * curr?.product?.price) ?? 0)
                                        },0)
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

            </div>
        </div>
    )
}