import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { Button } from '@tremor/react'
import { PencilIcon, PlusIcon } from 'lucide-react'
import React, { ReactNode } from 'react'

interface ModalProps {
    action: "create" | "edit"
    button_title: string
    modal_title: string
    children: ReactNode
    onClose: () => void
}

function Modal(props: Partial<ModalProps>) {
    const { action = "create", children, button_title, modal_title, onClose } = props
  return (
    <Dialog modal onOpenChange={(open)=>{
                    if(!open) return onClose?.()
    }} >
        <DialogTrigger asChild>
            <Button
                size="xs"
                icon={()=> action === "create" ?  <PlusIcon
                    size="16px"
                />: <PencilIcon/>}
            >
                {button_title}
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {modal_title}
                </DialogTitle>
            </DialogHeader>
            {
                children
            }
        </DialogContent>
    </Dialog>
  )
}

export default Modal