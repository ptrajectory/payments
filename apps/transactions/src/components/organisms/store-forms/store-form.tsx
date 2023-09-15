import React, { useState } from 'react'
import * as Form from "@radix-ui/react-form"
import { Input } from '@/components/atoms/input'
import { TextArea } from '@/components/atoms/textarea'
import { PlusIcon } from 'lucide-react'
import Upload from '@/components/atoms/upload'
import { isEmpty } from 'lodash'
import { Button } from '@/components/atoms/button'
import axios from 'axios'

function CreateStore() {

  const [image, setImage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    let data =  Object.fromEntries(new FormData(e.currentTarget))
    e.preventDefault()


    try {
        const result = (await axios.post("/api/store", {
            ...data,
            image
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
            name="name"
            aria-required
          >
            <div className="flex flex-col w-full">
              <Form.Label>
                Store Name
              </Form.Label>
              <Form.Control asChild>
                <Input
                  placeholder='Store Name'
                />
              </Form.Control>
              <Form.Message className='text-red text-sm font-medium' match={(val)=>isEmpty(val)} >
                Store Name is Required
              </Form.Message>

            </div>
          </Form.Field>


          <Form.Field
            name="description"
            className='w-full'
            aria-required
          >
            <div className="flex flex-col">
              <Form.Label>
                Description
              </Form.Label>
              <Form.Control asChild>
                <TextArea 
                  placeholder='Describe the store'
                />
              </Form.Control>
            </div>
          </Form.Field>

        </div>

        {/* right */}

        <div className="flex flex-col items-center justify-start w-1/2">
          <Form.Field
            name="image"
          >
            <div className="flex flex-col">
              <Form.Control asChild >
                <Upload onChange={setImage}/>
              </Form.Control>
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

export default CreateStore