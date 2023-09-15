import React, { useState } from 'react'
import * as Form from "@radix-ui/react-form"
import { Input } from '@/components/atoms/input'
import { TextArea } from '@/components/atoms/textarea'
import { PlusIcon } from 'lucide-react'
import Upload from '@/components/atoms/upload'
import { isEmpty } from 'lodash'
import { Button } from '@/components/atoms/button'
import { useRouter } from 'next/router'
import axios from 'axios'
import { PRODUCT } from 'zodiac'

type ProductFormProps = PRODUCT & {
  action?: "edit" | "create"
}

function ProductForm(props: ProductFormProps) {
  const { action, ...product } = props
  const [image, set_image] = useState("")
  const { query: {store_id, product_id} } = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const data =  Object.fromEntries(new FormData(e.currentTarget))
    e.preventDefault()

    try {
      const result = (await axios?.[action === "edit" ? "put" : "post"](`/api/products/${action == "edit" ? product_id : ""}`, {
        ...data,
        store_id: action === "edit" ? undefined: store_id,
        image: isEmpty(image) ? product.image : image,
        price:  Number(data.price) === product.price ? undefined : Number(data.price),
        name: data.name === product.name ? undefined : data.name,
        description: data.description === product.description ? undefined : data.description
      })).data

    }
    catch (e)
    {
      // TODO: handle error
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
                Product Name
              </Form.Label>
              <Form.Control  asChild>
                <Input
                  defaultValue={product?.name}
                  placeholder='Product Name'
                />
              </Form.Control>
              <Form.Message className='text-red text-sm font-medium' match={(val)=>isEmpty(val)} >
                Product Name is Required
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
              <Form.Control  asChild>
                <TextArea 
                  defaultValue={product?.description}
                  placeholder='Describe the product'
                />
              </Form.Control>
            </div>
          </Form.Field>


          <Form.Field
            name="price"
            className='w-full'
            aria-required
          >
            <div className="flex flex-col">
              <Form.Label>
                Price
              </Form.Label>
              <Form.Control asChild>
                <Input
                  defaultValue={product.price}
                  placeholder='300'
                  type="number"
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
              <Form.Control asChild  >
                <>
                  <Upload
                    onChange={set_image}
                  />
                </>
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

export default ProductForm