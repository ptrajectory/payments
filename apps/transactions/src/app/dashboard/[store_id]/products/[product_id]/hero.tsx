"use client"
import { Button } from '@/components/atoms/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { Separator } from '@/components/atoms/separator'
import ProductForm from '@/components/organisms/product-forms/create'
import { Card, Metric, Text } from '@tremor/react'
import Image from 'next/image'
import React from 'react'
import { PRODUCT } from 'zodiac'

interface Props {
    total_sales: number 
    customers: number
    product: PRODUCT
}

function ProductPageHero(props:Partial<Props>) {
    const { total_sales = 0, customers = 0, product = null } = props 
  return (
    <div className="flex flex-col p-5 rounded-md shadow-sm space-y-4">
              <div className="flex flex-row items-start justify-between p-5 rounded-md">
                
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
                            src={product?.image ?? ""}
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

                        <Dialog modal>
                            <DialogTrigger asChild>
                                <Button variant='secondary' className='w-full' >
                                    Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                      Edit Product
                                  </DialogTitle>
                                </DialogHeader>
                                <>
                                    <ProductForm
                                        action='edit'
                                        {...product}
                                    />
                                </>
                            </DialogContent>
                        </Dialog>
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