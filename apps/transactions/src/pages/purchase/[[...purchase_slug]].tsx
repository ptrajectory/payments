import payments from '@/lib/resources/payments'
import { cn } from '@/lib/utils'
import { isNull } from 'db/utils'
import { generate_dto } from 'generators'
import { isArray, isString, isUndefined } from 'lodash'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { CHECKOUT } from 'zodiac'

type ProductPurchasePageProps = {
  status: "success" | "error",
  message: string
  data: any | CHECKOUT
}

function ProductPurchasePage(props: ProductPurchasePageProps) {
  const { status, message, data } = props
  const { push } = useRouter()

  console.log("HERE's the data", data)

  useEffect(()=>{
    if(status === "success"){
      push(`/checkout/${data?.id}`)
    }
  }, [status])

  return (
    <div className="w-screen h-screen items-center justify-center flex flex-col">
        { 
          status === "error" ? <AlertCircle className='text-red-500' /> :
          status === "success" ? <CheckCircle className='text-green-500' />: 
          null
        }
        {
          <span className={cn(`text-sm font-semibold`, status === "error" ? "text-red-500" : "text-green-500")}>
            {message}
          </span>
        }
    </div>
  )
}

export default ProductPurchasePage

export const getServerSideProps: GetServerSideProps<ProductPurchasePageProps> = async (context ) => {

    const { purchase_slug, store_id, quantity = "1" } = context.query

    if(!isString(store_id)) return { props: generate_dto(null, "Store not specified", "error") }

    const [product_id] = isArray(purchase_slug) ? purchase_slug : []

    if(!isString(product_id)) return { props: generate_dto(null, "Product ID not specified", "error") }

    try{
      const product = await payments.product?.getProduct(product_id)
  
      if(isUndefined(product)) return { props: generate_dto(null, "Product not found", "error") }
  
      const new_cart = await payments.cart?.createCart({
        store_id
      })
  
      if(isUndefined(new_cart) || isUndefined(new_cart.id)) return { props: generate_dto(null, "Unable to create cart", "error") }
  
      const cart_item = await payments.cart?.addCartItem(new_cart?.id, {
        product_id: product.id,
        quantity: isString(quantity) ? !isNaN(Number(quantity)) ? Number(quantity) : 1 : 1,
        store_id
      })
  
      const checkout = await payments.checkout?.createCheckout({
        cart_id: new_cart?.id,
        store_id,
        currency: "KES"
      })

      return {
        props: generate_dto(checkout, "SUCCESS", "success")
      }

    }
    catch (e){
      console.log("THE ERROR::", e)
      // TODO: better error handling
      return {
        props: generate_dto(null, "Something went wrong", "error")
      }
    }

    
}