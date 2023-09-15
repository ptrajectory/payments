"use client";

import { isEmpty } from 'lodash';
import { Inbox } from 'lucide-react';
import React from 'react'

interface SimpleDisplayTableProps {
    data?: Array<{id?: string | number | null, value?: string | number | null}> | null,
    empty_message?: string
    title?: string
}

function SimpleDisplayTable(props: SimpleDisplayTableProps) {
  const { data, empty_message, title } = props 
  return (
    <div className="w-full h-full p-3 flex flex-col items-center justify-start space-y-2">
        <span className='text-sm font-medium mb-2 w-full text-left' >
            {title}
        </span>
        {
            isEmpty(data) ? (
                <div className="w-full h-full items-center justify-center flex flex-col space-y-2">
                    <Inbox
                        size="20px"
                        className='text-slate-400'
                    />
                    <span>
                        {empty_message ?? "No Data"}
                    </span>
                </div>
            ) : data?.map((row, i)=>{
                return (
                    <div key={i} className="flex flex-row w-full py-1 border-b-[1px] border-b-slate-50 items-center justify-between">
                        <span>
                            {row?.id}
                        </span>
                        <span>
                            {row?.value}
                        </span>
                    </div>
                )
            })
        }
    </div>
  )
}

export default SimpleDisplayTable