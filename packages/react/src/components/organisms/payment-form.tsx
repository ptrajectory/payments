import React, { useState } from 'react'
import Input from '../atoms/input'
import * as Form from "@radix-ui/react-form"
import PhoneNumberInput from '../atoms/phone-number-input'
import { Button } from '../atoms/button'
import { z } from 'zod'
import { AlertCircle } from 'lucide-react'
import { isEmpty } from 'lodash'
import { cn } from '../../lib'

type AdditionalField = {
    "first_name"?:{
        default_value: string
    },
    "last_name"?:{
        default_value: string
    },
    "email"?:{
        default_value: string
    }
}

interface PaymentFormProps {
    additional_fields?: AdditionalField
    amount?: number | string
    onFormSubmit?: (data: z.infer<typeof form_schema>) => void
    processing?: boolean
}

const form_schema = z.object({
    first_name: z.string().nonempty({
        message: "First name is required"
    }).optional(),
    last_name: z.string().nonempty({
        message: "Last name is required"
    }).optional(),
    email: z.string().email({
        message: "Invalid email address"
    }).optional(),
    phone_number: z.string().nonempty({
        message: "Phone number is required"
    }).min(12, {
        message: "Phone number must be 9 digits long"
    }).max(12, {
        message: "Phone number must be 9 digits long"
    }).optional(),
})




function PaymentForm(props: PaymentFormProps) {
    const { additional_fields, amount, onFormSubmit, processing } = props

    const [formInput, setFormInput] = useState<{
        data: z.infer<typeof form_schema> | null,
        errors: {
            first_name?: string | null,
            last_name?: string | null,
            email?: string | null,
            phone_number?: string | null,
        } | null
    }>({
        data: {
            email: additional_fields?.email?.default_value ?? undefined,
            first_name: additional_fields?.first_name?.default_value ?? undefined,
            last_name: additional_fields?.last_name?.default_value ?? undefined,
            phone_number: undefined,
        },
        errors: null
    })

    const handle_field_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const value = e.target.value
        const name = e.target.name

        setFormInput((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                [name]: value
            }
        }))
    }

    const set_phone_number = (phone_number: string) => {
        setFormInput((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                phone_number
            }
        }))
    }

    const handle_form_submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if(!formInput.data) return 

        const parsed = form_schema.required({
            phone_number: true,
            first_name: additional_fields?.first_name?.default_value ? true : undefined,
            last_name: additional_fields?.last_name?.default_value ? true : undefined,
            email: additional_fields?.email?.default_value ? true : undefined,
        }).safeParse(formInput.data)

        if (parsed.success) {
            setFormInput((prev)=>{
                return {
                    ...prev,
                    errors: null
                }
            })

            onFormSubmit?.(parsed.data)
            return
        }
        const field_errors = parsed.error.formErrors.fieldErrors

        const all_errors = {
            first_name: field_errors?.first_name?.[0],
            last_name: field_errors?.last_name?.[0],
            email: field_errors?.email?.[0],
            phone_number: field_errors?.phone_number?.[0],
        }
        setFormInput((prev)=>{
            return {
                ...prev,
                errors: {
                    first_name: all_errors?.first_name ?? undefined,
                    last_name: all_errors?.last_name ?? undefined,
                    email: all_errors?.email ?? undefined, 
                    phone_number: all_errors?.phone_number ?? undefined,
                }
            }
        })

    }


  return (
    <Form.Root
        className='flex flex-wrap flex-row px-10 py-5 space-y-2'
        onSubmit={handle_form_submit}
    >
        {formInput.errors && <div className="flex flex-col w-full font-inter text-sm justify-center space-y-1 text-red-400 bg-red-50 ring-1 ring-red-600  rounded-md px-3 py-2">
            {
                Object.values(formInput.errors ?? {})?.filter((value)=> !isEmpty(value)).map((error, index) => (
                    <span
                        className='flex flex-row items-center w-full space-x-1'
                        key={index}
                    >
                        <AlertCircle
                            className='w-4 h-4'
                        />
                        <span>
                            {error}
                        </span>
                    </span>
                ))
            }
        </div>}
        <Form.Field
            className="w-full flex flex-col"
            name="phone_number"
            aria-required
        >
            <Form.Label
                className='font-inter font-medium text-[14px] text-left'
            >
                Phone Number
            </Form.Label>
          <Form.Control asChild >
            <PhoneNumberInput
                onPhoneNumberChange={set_phone_number}
            />
          </Form.Control>
        </Form.Field>
        <div className="flex flex-row w-full items-center justify-between space-x-2">
            { additional_fields?.first_name && <Form.Field 
                className={
                    cn("flex flex-col",additional_fields?.last_name ? "w-1/2" : "w-full")
                }
                name="first_name"
                defaultValue={additional_fields?.first_name?.default_value}
                onChange={handle_field_change}
                aria-required
            >
                <Form.Label
                    className='font-inter font-medium text-[14px] text-left'
                >
                    First Name
                </Form.Label>
                <Form.Control asChild>
                    <Input
                        defaultValue={additional_fields?.first_name?.default_value}
                        placeholder="First Name"
                    />
                </Form.Control>
            </Form.Field>}

            {additional_fields?.last_name && <Form.Field 
                className={
                    cn("flex flex-col",additional_fields?.first_name ? "w-1/2" : "w-full")
                }
                name="last_name"
                defaultValue={additional_fields?.last_name?.default_value}
                onChange={handle_field_change}
                aria-required
            >
                <Form.Label
                    className='font-inter font-medium text-[14px] text-left w-full'
                >
                    Last Name
                </Form.Label>
                <Form.Control asChild>
                    <Input
                        defaultValue={additional_fields?.last_name?.default_value}
                        placeholder="Last Name"
                    />
                </Form.Control>
            </Form.Field>}
        </div>

        {additional_fields?.email && <Form.Field
            className="w-full flex flex-col"
            name="email"
            defaultValue={additional_fields?.email?.default_value}
            onChange={handle_field_change}
            aria-required
        >   
            <Form.Label
                className='font-inter font-medium text-[14px] text-left'
            >
                Email
            </Form.Label>
            <Form.Control asChild>
                <Input
                    defaultValue={additional_fields?.email?.default_value}
                    placeholder="Email"
                    type="email"
                />
            </Form.Control>
        </Form.Field>}
        <Form.Submit  asChild>
            <Button isLoading={processing} disabled={isEmpty(formInput.data?.phone_number)} className='w-full' loadingText='Processing' >
                <span
                    className='text-white font-inter font-semibold'
                >
                Pay <span className='text-green-500' >{ amount ? `${amount} KSH` : null }</span>  with M-Pesa
                </span>
            </Button>
        </Form.Submit>
    </Form.Root>
  )
}

export default PaymentForm