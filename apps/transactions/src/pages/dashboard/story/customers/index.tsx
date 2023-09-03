import { DataTable } from "@/components/headless/data-table"
import CustomerColumns from "@/components/headless/data-tables/customers/columns"
import { PageLayoutProps } from "@/lib/types"
import { Button, Text } from "@tremor/react"
import { PlusIcon } from "lucide-react"
import { GetServerSideProps } from "next"
import { CUSTOMER } from "zodiac"
import db from "db"
import { stringify } from "querystring"
import { stringifyDatesInJSON } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog"
import CreateCustomer from "@/components/organisms/customer-forms/create"
import { useRouter } from "next/navigation"
// import { useRouter } from "next/router"


interface CustomerPageProps {
    customers: Array<CUSTOMER> 
}


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


function CustomersPage(props: CustomerPageProps){
    const { customers } = props

    const { push } = useRouter()
    return (
        <div className="flex flex-col w-full h-full space-y-5">

            <div className="flex flex-row w-full items-center justify-between ">
                <span className="font-semibold text-xl">
                    Customers
                </span>
                <Dialog modal onOpenChange={(open)=>{
                }} >
                    <DialogTrigger asChild>
                        <Button
                            size="xs"
                            icon={()=> <PlusIcon
                                size="16px"
                            />}
                        >
                            Create Customers
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Create Customer
                            </DialogTitle>
                        </DialogHeader>
                        <CreateCustomer/>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col w-full">

                <DataTable
                    data={customers}
                    columns={CustomerColumns}

                />

            </div>
            

        </div>
    )
}

export default CustomersPage 



export const getServerSideProps: GetServerSideProps<PageLayoutProps & CustomerPageProps> = async (context)=> {

    const { store_id } = context.query
    let customers: Array<CUSTOMER> | null = null 
    let error: string | null = null
    try {

        customers = await db.query.CUSTOMER.findMany({
            where: (customers, {and, eq})=> eq(customers.store_id, store_id)
        })

        customers = stringifyDatesInJSON(customers)

    }
    catch (e)
    {
        error = "SOMETHING WENT WRONG"
    }

    return {
        props: {
            layout: "dashboard",
            customers: customers ?? []
        }
    }
}