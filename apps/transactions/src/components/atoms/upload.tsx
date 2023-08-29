import { cn } from '@/lib/utils'
import { Files, PlusIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'

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

        //TODO: do something with the files

        onChange?.("https://images.pexels.com/photos/2609537/pexels-photo-2609537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")
    }




  return (
    <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={()=>{
        input_ref?.current?.click()
    }} className="flex flex-col items-center justify-center rounded-md border-2 border-dashed space-y-2 w-full p-5 border-gray-400">
        <Files
            size="20px"
            className={cn("border-gray-400",isActive ? "animate-bounce" : "")}
        />
        <span>
            Drag and Drop image(s) here
        </span>
        <input
            ref={input_ref}
            hidden
            type='file'
            accept='image/*'

        />
    </div>
  )
}

export default Upload