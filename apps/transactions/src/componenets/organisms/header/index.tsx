import React from 'react'
import { ArrowLeftIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from '@/componenets/atoms/avatar'

function Header() {
  return (
    <div className="flex flex-row items-center justify-start space-x-2">
        <button className="bg-none border-0">
            <ArrowLeftIcon
              className=' text-gray-400'
              size={"20px"}
            />
        </button>
        <div className="flex flex-row items-center justify-start space-x-2">
          <Avatar>
            <AvatarImage className='p-1' src="https://www.iamonyino.com/brand/ptrajectory.svg" />
            <AvatarFallback>
              Logo
            </AvatarFallback>
          </Avatar>
          <h2 className="font-semibold capitalize ">
              ptrajectory
          </h2>
        </div>
    </div>
  )
}

export default Header