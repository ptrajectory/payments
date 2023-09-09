import { SkeletonBlock } from '@/layouts/skeletons'
import React from 'react'

function PageLoading() {
  return (
    <div className="w-screen h-screen flex flex-col items-center p-5 gap-y-4">

        <SkeletonBlock
            className='w-full p-5'
        />

        <div className="flex flex-row w-full h-[80vh]">

            <SkeletonBlock
                className='w-full h-full'
            />
        </div>

    </div>
  )
}

export default PageLoading