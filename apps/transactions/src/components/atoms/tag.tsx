import React, { ReactNode } from 'react'

interface TagProps {
    childre: ReactNode
}

function Tag() {
  return (
    <div role="button" className=" bg-gray-200 rounded-sm px-2">
        <span className='text-xs' >
            Qty 2
        </span>
    </div>
  )
}

export default Tag