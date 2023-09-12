import { cn } from '@/lib/utils'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { Files, PlusIcon, Recycle, Trash2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import Image from 'next/image'

type UploadProps = {
    onChange?: (val: string) => void,
    images?: string[],
    multiple?: boolean
}

function Upload(props: UploadProps) {
    const { onChange, multiple, images: parent_images } = props 
    const [images, setImages] = useState(parent_images??[])


    const [isActive, setIsActive] = useState(false)
    const input_ref = useRef<HTMLInputElement>(null)


    const handleRemoveImage = (index: number) => {
        setImages((prev)=> prev.filter((_, i) => i !== index)) 
        onChange?.("")
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsActive(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsActive(false)
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsActive(false)
        
        const files = e?.dataTransfer?.files

        if(isEmpty(files) || isUndefined(files) || isNull(files)) return

        const form = new FormData()
        for (let i =0; i <files?.length; i++){
            const file = files.item(i)

            if(isNull(file) || isUndefined(file)) continue 

            form.append(`ptrajectory-payments-upload-${i}-${file.name}`,file, file.name)
            
        }

        try {
            const result = (await axios.post("/api/upload", form)).data
            result?.data && setImages((prev) => multiple ?  [...prev, result?.data?.secure_url] : [result?.data?.secure_url])
            onChange?.(result?.data?.secure_url)
        }
        catch (e)
        {
            // TODO: display error toasr
        }
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsActive(true)

        const files = e.target.files 
        if(isEmpty(files) || isUndefined(files) || isNull(files)) return
        const form = new FormData()

        for (let i =0; i <files?.length; i++){

            const file = files.item(i)
            console.log(file)
            if(isNull(file) || isUndefined(file)) continue 

            form.append(`ptrajectory-payments-upload-${i}-${file.name}`,file, file.name)
            
        }

        try {
            const result = (await axios.post("/api/upload", form)).data
            result?.data && setImages((prev) => multiple ?  [...prev, result?.data?.secure_url] : [result?.data?.secure_url])
            onChange?.(result?.data?.secure_url)
        }
        catch (e)
        {
            // TODO: display error toasr
        }
        finally {
            setIsActive(false)
            e.target.value = ""
        }
    }




  return (
    <div className="flex flex-col w-full">
        <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={()=>{
            input_ref?.current?.click()
        }} className="flex flex-col items-center justify-center rounded-md border-2 border-dashed space-y-2 w-full p-5 border-gray-400 cursor-pointer">
            <Files
                size="20px"
                className={cn("border-gray-400",isActive ? "animate-bounce" : "")}
            />
            <span>
                {
                    isActive ? "Uploading..." : "Drag and Drop image(s) here"
                }
                
            </span>
            <input 
                onChange={handleImageSelect}
                ref={input_ref}
                hidden
                type='file'
                accept='image/*'
                multiple={multiple}
            />
        </div>

        <div className="grid grid-cols-3 gap-x-3 gap-y-2 w-full py-5">
            {
                images?.map((image, i)=>{
                    return (
                        <div key={i} className={cn("flex w-full h-[100px] flex-row items-center justify-center overflow-hidden relative rounded-sm ")}>
                            <Image
                             alt={`Upload ${i}`}
                             fill 
                             src={image}
                             style={{
                                objectFit: 'cover'
                             }}
                            />

                            <button onClick={()=> handleRemoveImage(i)}  className='absolute bottom-0 right-0 mx-5 my-5 rounded-full overflow-hidden group hover:bg-slate-200 p-2'>
                                <Trash2
                                    size="16px"
                                    className='group-hover:text-red-500'
                                />
                            </button>
                        </div>
                    )
                })
            }
        </div>

    </div>
  )
}

export default Upload