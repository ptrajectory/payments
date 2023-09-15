import React, { useState } from 'react'
import * as Form from "@radix-ui/react-form"
import { Input } from '@/components/atoms/input'
import { TextArea } from '@/components/atoms/textarea'
import { PlusIcon } from 'lucide-react'
import Upload from '@/components/atoms/upload'
import { isEmpty } from 'lodash'
import { Button } from '@/components/atoms/button'
import axios from 'axios'
import { useRouter } from 'next/router'

function CreateCustomer() {

  const { query } = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    let data =  Object.fromEntries(new FormData(e.currentTarget))
    e.preventDefault()


    try {
        const result = (await axios.post("/api/customers", {
            ...data,
            store_id: query.store_id
        })).data


    }
    catch (e)
    {
        // TODO: better error handling
    }

  }

  return (
    <Form.Root
      className='flex flex-col items-start justify-start w-full'
      onSubmit={handleSubmit}
    >
      <div className="flex flex-row items-center justify-between space-x-4 w-full">

        {/* left */}

        <div className="flex flex-col items-center justify-start w-1/2 space-y-2 ">

          <Form.Field
            className='w-full'
            name="first_name"
            aria-required
          >
            <div className="flex flex-col w-full">
              <Form.Label>
                First Name
              </Form.Label>
              <Form.Control asChild>
                <Input
                  placeholder='First Name'
                />
              </Form.Control>
              <Form.Message className='text-red text-sm font-medium' match={(val)=>isEmpty(val)} >
                First Name is Required
              </Form.Message>
            </div>
          </Form.Field>

          <Form.Field
            className='w-full'
            name="last_name"
            aria-required
          >
            <div className="flex flex-col w-full">
              <Form.Label>
                Last Name
              </Form.Label>
              <Form.Control asChild>
                <Input
                  placeholder='Last Name'
                />
              </Form.Control>
              <Form.Message className='text-red text-sm font-medium' match={(val)=>isEmpty(val)} >
                Last Name is Required
              </Form.Message>
            </div>
          </Form.Field>

          <Form.Field
            className='w-full'
            name="email"
            aria-required
          >
            <div className="flex flex-col w-full">
              <Form.Label>
                Email
              </Form.Label>
              <Form.Control asChild>
                <Input
                  placeholder='Email'
                  type="email"
                />
              </Form.Control>
              <Form.Message className='text-red text-sm font-medium' match={(val)=>isEmpty(val)} >
                Email is Required
              </Form.Message>
            </div>
          </Form.Field>


        </div>

  

       


      </div>
      <div className="flex flex-row w-full items-center justify-start py-5">
        <Form.Submit asChild
         >
          <Button>
            Submit
          </Button>
        </Form.Submit>
      </div>
    </Form.Root>
  )
}

export default CreateCustomer