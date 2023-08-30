import { cn } from '@/lib/utils'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { Files, PlusIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import axios from "axios"

type UploadProps = {
    onChange?: (val: string) => void
}

function Upload(props: UploadProps) {

    const { onChange } = props 

    const [isActive, setIsActive] = useState(false)
    const input_ref = useRef<HTMLInputElement>(null)

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

            if(isNull(file) || isUndefined(file)) continue 

            form.append(`ptrajectory-payments-upload-${i}-${file.name}`,file, file.name)
            
        }

        try {
            const result = (await axios.post("/api/upload", form)).data

            onChange?.(result?.data?.secure_url)
        }
        catch (e)
        {
            // TODO: display error toasr
        }
        finally {
            setIsActive(false)
        }
    }




  return (
    <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={()=>{
        input_ref?.current?.click()
    }} className="flex flex-col items-center justify-center rounded-md border-2 border-dashed space-y-2 w-full p-5 border-gray-400 cursor-pointer">
        <Files
            size="20px"
            className={cn("border-gray-400",isActive ? "animate-bounce" : "")}
        />
        <span>
            Drag and Drop image(s) here
        </span>
        <input 
            onChange={handleImageSelect}
            ref={input_ref}
            hidden
            type='file'
            accept='image/*'
            multiple={false}
        />
    </div>
  )
}

export default Upload