import { DataTable } from "@/components/headless/data-table"
import CustomerColumns from "@/components/headless/data-tables/customers/columns"
import { PageLayoutProps } from "@/lib/types"
import { Button, Text } from "@tremor/react"
import { PlusIcon } from "lucide-react"
import { GetServerSideProps } from "next"
import { CUSTOMER } from "zodiac"


const fake_customer_data: Array<CUSTOMER> = [
    {
        id: "1",
        created_at: (new Date()).toString(),
        email: "jamesdean@email.com",
        first_name: "James",
        last_name: "Dean",
    },
    {
        id: "2",
        created_at: (new Date()).toISOString(),
        email: "tonystark@email.com",
        first_name: "Tony",
        last_name: "Stark"
    }
]


function CustomersPage(){
    return (
        <div className="flex flex-col w-full h-full space-y-5">

            <div className="flex flex-row w-full items-center justify-between ">
                <span className="font-semibold text-xl">
                    Customers
                </span>

                <Button
                    size="xs"
                    icon={()=> <PlusIcon
                        size="16px"
                    />}
                >
                    Create Customers
                </Button>
            </div>

            <div className="flex flex-col w-full">

                <DataTable
                    data={fake_customer_data}
                    columns={CustomerColumns}
                />

            </div>
            

        </div>
    )
}

export default CustomersPage 

export const getServerSideProps: GetServerSideProps<PageLayoutProps> = async ()=> {
    return {
        props: {
            layout: "dashboard",
        }
    }
}