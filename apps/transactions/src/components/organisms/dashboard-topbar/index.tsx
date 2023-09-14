"use client";
import Logo from '@/components/atoms/logo'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import StoreDetails from './store-details';
import { SkeletonBlock } from '@/layouts/skeletons';

interface DashboardProps {
  store_id?: string
  customer_id?: string
  product_id?: string
}

function DashboardTopBar(props: DashboardProps) {
  console.log(props)
  const query = useParams()
  const [scrolled, setScrolled] = useState(false)
  const { push } = useRouter()
  const { user } = useUser()

  useEffect(()=>{
    const handleScroll = () => {
      if(window.scrollY > 50) {
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
    <>
      <div className={`flex flex-row items-center justify-between w-screen px-5 py-5 border-b-[1px] transition-all ${ scrolled ? "fixed bg-opacity-50 backdrop-blur-lg" : "relative "} z-10  bg-white`}>
        <div className="flex flex-row items-center justify-start space-x-4 ">
            <div role='button' onClick={()=>push("/dashboard")} className="flex flex-row">
              <Logo/>
            </div>
          <span className="text-2xl text-gray-200 ">
            /
          </span>
            <StoreDetails
              store_id={props.store_id}
            />
        </div>

        <div className="flex flex-row items-center justify-end">
          <UserButton/> 
        </div>
      </div>
      {
        scrolled && <div className="flex flex-row w-full h-[100px]"></div>
      }
    </>
  )
}

export default DashboardTopBar