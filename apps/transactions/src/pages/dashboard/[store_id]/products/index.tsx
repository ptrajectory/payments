import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog"
import { DataTable } from "@/components/headless/data-table"
import ProductColumns from "@/components/headless/data-tables/products/columns"
import CreateProduct from "@/components/organisms/product-forms/create"
import { PageLayoutProps } from "@/lib/types"
import { Button } from "@tremor/react"
import { PlusIcon } from "lucide-react"
import { GetServerSideProps } from "next"
import { PRODUCT } from "zodiac"

const camera_image = "https://images.pexels.com/photos/414781/pexels-photo-414781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

const fake_product_data: Array<PRODUCT> = [
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


function ProductsPage(){
    return (
        <div className="flex flex-col w-full h-full space-y-5 ">

            <div className="flex flex-row w-full items-center justify-between">
                <span className="font-semibold text-xl">
                    Products
                </span>

                <Dialog modal  >
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
                        <CreateProduct/>
                    </DialogContent>
                </Dialog>

            </div>
            

            <div className="flex flex-col w-full h-full">


                <DataTable
                    data={fake_product_data}
                    columns={ProductColumns}
                />
                

            </div>

        </div>
    )
}

export default ProductsPage 

export const getServerSideProps: GetServerSideProps<PageLayoutProps> = async ()=> {
    return {
        props: {
            layout: "dashboard",
        }
    }
}