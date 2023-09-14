"use client"
import { Badge } from '@tremor/react'
import axios from 'axios'
import db from 'db'
import { isString } from 'lodash'
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { STORE } from 'zodiac'


function StoreDetails(props: any) {
    const {store_id} = useParams()
    const pathname = usePathname()

    const [store, setStore] = useState<STORE|null>(null)
    const getStoreData = async (store_id: string) => {
    
        try {
            const result = (await axios.get(`/api/stores/${store_id}`)).data.data ?? null 

            setStore(()=>result)
        }
        catch (e)
        {
            console.log(e)
            // TODO: will handle error later
            return null
        }
    
    }

    useEffect(()=>{
        if(isString(store_id) && store_id.length > 3){
            getStoreData(store_id)
        }else{
            setStore(null)
        }
    }, [pathname, store_id])

  return (
    <div className="flex flex-row items-center justify-start space-x-2">
        <span className="font-medium">
            { store?.name ?? store_id }
        </span>
        {store?.environment && <Badge size='sm'>
            {
                store?.environment
            }
        </Badge>}
    </div>
  )
}

export default StoreDetails