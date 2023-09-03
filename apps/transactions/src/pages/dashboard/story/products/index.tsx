import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog"
import { DataTable } from "@/components/headless/data-table"
import ProductColumns from "@/components/headless/data-tables/products/columns"
import ProductForm from "@/components/organisms/product-forms/create"
import { PageLayoutProps } from "@/lib/types"
import { Button } from "@tremor/react"
import { PlusIcon } from "lucide-react"
import { GetServerSideProps } from "next"
import { store, PRODUCT as tPRODUCT } from "zodiac"
import db from "db"
import { stringifyDatesInJSON } from "@/lib/utils"
import { useRouter } from "next/router"

const camera_image = "https://images.pexels.com/photos/414781/pexels-photo-414781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

const fake_product_data: Array<tPRODUCT> = [
    {
        id: "1pr_3422",
        image: camera_image,
        name: "Cool Camera",
        price: 30000
    },
    {
        id: "2",
        image: camera_image,
        name: "Classic Camera",
        price: 40000
    },
    {
        id: "3",
        image: camera_image,
        name: "Cool Camera",
        price: 30000
    },
    {
        id: "4",
        image: camera_image,
        name: "Classic Camera",
        price: 40000
    }
]


type ProductsPageProps = {
    products: Array<tPRODUCT>
}

function ProductsPage(props: ProductsPageProps){

    const { asPath, push} = useRouter()

    const { products } = props


    return (
        <div className="flex flex-col w-full h-full space-y-5 ">

            <div className="flex flex-row w-full items-center justify-between">
                <span className="font-semibold text-xl">
                    Products
                </span>

                <Dialog modal  onOpenChange={(open)=>{
                    if(!open) return push(asPath)
                }} >
                    <DialogTrigger asChild>
                        <Button
                            size="xs"
                            icon={()=> <PlusIcon
                                size="16px"
                            />}
                        >
                            Create Products
                        </Button>
                    </DialogTrigger>
                    <DialogContent  >
                        <DialogHeader>
                            <DialogTitle>
                                Create Product
                            </DialogTitle>
                        </DialogHeader>
                        <ProductForm />
                    </DialogContent>
                </Dialog>

            </div>
            

            <div className="flex flex-col w-full h-full">


                <DataTable
                    data={products}
                    columns={ProductColumns}
                />
                

            </div>

        </div>
    )
}

export default ProductsPage 

export const getServerSideProps: GetServerSideProps<PageLayoutProps & ProductsPageProps> = async (context)=> {

    let products: Array<tPRODUCT> = []
    const { store_id, page = "1", size = "10" } = context.query
    
    const parsed_page = isNaN(Number(page)) ? 1 : Number(page)
    const parsed_size = isNaN(Number(size)) ? 10 : Number(size)

    console.log(parsed_size, parsed_page)
    console.log("THE STORE ID::", store_id)
    try {

        products = await db.query.PRODUCT.findMany({
            where: (prods, {eq}) => eq(prods.store_id, store_id),
            // limit: parsed_size,
            // offset: ( parsed_page - 0 ) * parsed_size
        })

        products = stringifyDatesInJSON(products)


    }   
    catch (e)
    {
        // TODO: deal with error 
    }

    return {
        props: {
            layout: "dashboard",
            products
        }
    }
}