"use client"
import React from 'react'
import Image from 'next/image'

function Logo() {
  return (
    <div className="flex flex-row items-center justify-center relative w-10 h-10 cursor-pointer">
        <Image
            sizes='(max-width: 768px) 40px; (max-width: 1200px) 40px, 40px'
            src="/brand/ptrajectory.png"
            fill 
            alt="Ptrajectory's logo"
            style={{
                objectFit: 'contain'
            }}
        />
    </div>
  )
}

export default Logo