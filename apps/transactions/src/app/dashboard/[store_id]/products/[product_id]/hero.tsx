"use client"
import { Button } from '@/components/atoms/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { Separator } from '@/components/atoms/separator'
import ProductForm from '@/components/organisms/product-forms/create'
import { Card, Metric, Text } from '@tremor/react'
import Image from 'next/image'
import React from 'react'
import { PRODUCT } from 'zodiac'
import EditProductForm from './edit-product-form'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from "next/navigation"
import Link from 'next/link'
import GeneratePurchaseLink from './create-purchase-link'

interface Props {
    total_sales: number 
    customers: number
    product: PRODUCT
}

function ProductPageHero(props:Partial<Props>) {
    const { total_sales = 0, customers = 0, product = null } = props 
    const { store_id } = useParams()

  return (
    <div className="flex flex-col p-5 rounded-md shadow-sm space-y-4">
            <div className="flex flex-row items-center justify-start w-full ">
                <Link
                    href={`/dashboard/${store_id}/products`}
                >
                    <button className=" group border-none rounded-full p-2 hover:bg-gray-200 ">
                        <ArrowLeft 
                            className={`text-gray-400 group-hover:text-black`}
                            size="16px"
                        />
                    </button>
                </Link>
            </div>
              <div className="flex flex-row items-start justify-between p-5 pt-1 rounded-md">
                
                {/* left side */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <span className="font-semibold text-sm">
                        Product Name
                    </span>
                    <span>
                        {product?.name}
                    </span>

                    <span className="font-semibold text-sm">
                        Product Price
                    </span>
                    <span>
                        KES {product?.price}
                    </span>

                    <span className="font-semibold text-sm">
                        Product Description
                    </span>
                    <span>
                        {product?.description}
                    </span>

                    <span className="font-semibold text-sm">
                        Product Image
                    </span>
                    <div className="flex flex-row items-center justify-center relative w-12 h-12 rounded-sm overflow-hidden">
                        <Image
                            sizes='48px'
                            src={product?.image ?? "/brand/placeholder_image.png"}
                            alt='Camera Image'
                            fill 
                            style={{
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>

                {/* right side */}

                  <div className="flex flex-col items-end justify-start space-y-5 ">

                        <EditProductForm
                            data={product}
                        />

                        <GeneratePurchaseLink
                            product_id={product?.id ?? "no id"}
                        />
                </div>
            </div>
            <Separator
                
            />
            <div className="flex flex-row items-center gap-x-5 justify-between w-full">
                <Card>
                    <Text>
                        Total Sales
                    </Text>
                    <Metric>
                        KES {total_sales}
                    </Metric>
                </Card>

                <Card>
                    <Text>
                        Customers
                    </Text>
                    <Metric>
                        {customers}
                    </Metric>
                </Card>
            </div>
        </div>
  )
}

export default ProductPageHero