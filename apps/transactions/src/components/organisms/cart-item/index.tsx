import Tag from '@/components/atoms/tag'
import Image from 'next/image'
import React from 'react'

const bag_image = "https://images.pexels.com/photos/14111067/pexels-photo-14111067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

function CartItem() {
    return (
        <div className="flex flex-row items-center justify-start w-full space-x-2">
            <div className="relative flex flex-row items-center justify-center w-10 h-10 rounded-md overflow-hidden">
                <Image
                    src={bag_image}
                    alt="Cart Item"
                    fill
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </div>
            <div className="flex flex-col items-start justify-center w-4/5 ">
                <div className="flex flex-row items-center justify-between w-full">
                    <p className="text-xs">
                        Camera
                    </p>
                    <p className='text-xs' >
                        $65.00
                    </p>
                </div>
                <div className="flex flex-row items-center justify-start w-full">
                    <Tag></Tag>
                </div>
            </div>
        </div>
    )
}

export default CartItem