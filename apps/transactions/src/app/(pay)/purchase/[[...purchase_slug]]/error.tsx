"use client"
import { XCircle } from 'lucide-react'
import React from 'react'

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen space-y-3">

        <XCircle
            className='text-red-400'
        />

        <span
            className='text-red-400 text-sm font-semibold'
        >
            Something went wrong
        </span> 

    </div>
  )
}

export default ErrorPage