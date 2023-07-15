import React from 'react'
import z from 'zod'
import { isEmpty } from 'lodash'
import Input from '../input'

//

export interface PhoneNumberInputProps {
    onPhoneNumberChange?: (phone_number: string) => void
}

const formatter = (str: string) => {
    const formatted = str.replace(/\B(?=(\d{3})+(?!\d))/g, ",")?.replace(/,/g, ' ')
    return formatted
}

const isNumber = (str: string) => {
    return /^\d+$/.test(str);
}

const phone_number_schema = z.string()
    .transform((val) => {
        const without_starting_zero = val?.trim()?.replace(/^0+/, '')
        return without_starting_zero?.trim()?.replace(/\s/g, "")
    })
    .transform((val) => {
        const formatted = formatter(val?.trim())
        return formatted
    })

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, PhoneNumberInputProps {}


const PhoneNumberInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onPhoneNumberChange, onChange, ...input_props } = props
    const [phone_number, set_phone_number] = React.useState('')

    const handle_phone_number_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const value = e.target.value

        if (isEmpty(value)) return set_phone_number('')

        if (!isNumber(value?.replace(/\s/g, ""))) return

        if (value.length > 11) return

        const result = phone_number_schema.safeParse(value)

        if (result.success) {
            set_phone_number(result.data)

            onPhoneNumberChange?.(`254${result.data?.replace(/\s/g, "")}`)
        }


    }
    return (
        <div className="flex flex-row items-center justify-between w-full h-10 rounded-[6px] overflow-hidden ">
            <div className="flex flex-row items-center justify-between h-10 w-full">
                <div className="flex flex-row items-center px-5 justify-between h-10 bg-black ">
                    <span
                        className='text-white text-[14px] font-medium font-inter mr-2'
                    >
                        +
                    </span>
                    <span
                        className='text-white text-[14px] font-medium font-inter '
                    >
                        254
                    </span>
                </div>
                <Input
                    ref={ref}
                    {...input_props}
                    type="tel"
                    maxLength={12}
                    placeholder='Phone Number'
                    className="border-l-0 rounded-l-none"
                    value={phone_number}
                    onChange={handle_phone_number_change}
                />
            </div>
        </div>
    )
})

PhoneNumberInput.displayName = "PhoneNumberInput"

export default PhoneNumberInput