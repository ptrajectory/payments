import React, { Suspense } from 'react'
import CredentialTable from './components/credential-table'
import { SkeletonBlock } from '@/layouts/skeletons'

function CredentialsPage(props: {
    params: { store_id: string }
}) {
    const { store_id } = props.params
  return (
    <div className="flex flex-col w-full h-full items-start justify-start p-5 pb-[200px]">

        <h1 className="text-2xl font-semibold">
            API Keys
        </h1>
        <span className="text-sm">
            View and manage your payment API Keys
        </span>

        <div className="flex flex-col w-full py-5">

            {store_id && <Suspense 
            
                fallback={<SkeletonBlock
                    className='py-10 w-full'
                />}
            >
                <CredentialTable
                    store_id={store_id}
                />
            </Suspense>}

        </div>
    </div>
  )
}

export default CredentialsPage