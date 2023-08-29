import React from 'react'
import Image from 'next/image'

function Logo() {
  return (
    <div className="flex flex-row items-center justify-center relative w-8 h-8">
        <Image
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