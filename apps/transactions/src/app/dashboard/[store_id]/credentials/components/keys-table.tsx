"use client";

import { isEmpty } from 'lodash';
import { CheckSquare, Clipboard, Inbox } from 'lucide-react';
import React, { useRef, useState } from 'react'
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from 'dayjs';
dayjs.extend(relativeTime)

interface SimpleDisplayTableProps {
    data?: Array<{id?: string | number | null, value?: string | number | null}> | null,
    empty_message?: string
    title?: string
}

interface KeyValues {
    date?: string,
    type?: string,
    value?: string
}
function KeyRow(props: KeyValues) {
    const [copy_active, set_copy_active] = useState(false)
    const { date, value } = props

    const handleCopy = () =>{
        set_copy_active(true)
        navigator.clipboard.writeText(value ?? "")
        .then(()=>{

        })
        .catch(()=>{

        })
        .finally(()=>{
            setTimeout(()=>{
                set_copy_active(false)
            }, 3000)
        })
    }

    return (
        <div className="flex flex-row w-full py-1 border-b-[1px] border-b-slate-50 items-center justify-between gap-x-1">
            <span>
                Created {dayjs(date).fromNow()}
            </span>
            <span className='text-sm text-slate-500' >
                {
                    value?.includes("prod") ? `prod_************************************` : "test_************************************"
                }
            </span>
            {
                copy_active ? <CheckSquare  size="18px" className=' text-amber-500 ' /> : <Clipboard size="18px" className='text-slate-200 cursor-pointer hover:text-black' onClick={handleCopy} />
            }
        </div>
    )
}

export default function KeysTable(props: SimpleDisplayTableProps) {
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
                        {empty_message ?? "That's weird, you don't have any secret keys; try deleting this store."}
                    </span>
                </div>
            ) : data?.map((row, i)=>{
                return (
                    <KeyRow
                        key={i}
                        value={row.value as string}
                        date={row.id as string}
                    />
                )
            })
        }
    </div>
  )
}