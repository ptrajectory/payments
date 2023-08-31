import Logo from '@/components/atoms/logo'
import { UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function DashboardTopBar() {
  const [scrolled, setScrolled] = useState(false)
  const { query } = useRouter()
  const { user } = useUser()

  useEffect(()=>{
    const handleScroll = () => {
      if(window.scrollY > 60) {
        setScrolled(true)
      }else{
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return ()=>{
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={`flex flex-row items-center justify-between w-screen px-5 py-5 border-b-[1px] transition-all ${ scrolled ? "fixed bg-opacity-50 backdrop-blur-lg" : "relative "} z-10  bg-white`}>
      <div className="flex flex-row items-center justify-start space-x-4 ">
        <Logo/>
        <span className="text-2xl text-gray-200 ">
          /
        </span>
        <h4 className="text-md font-medium">
          {
            query?.store_id
          }
        </h4>
      </div>

      <div className="flex flex-row items-center justify-end">
        <UserButton/> 
      </div>
    </div>
  )
}

export default DashboardTopBar