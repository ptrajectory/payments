import { ColumnDef, Row, createColumnHelper } from '@tanstack/react-table'
import { CUSTOMER, PAYMENT_METHOD, PRODUCT } from 'zodiac'
import { DataTableColumnHeader } from '../../data-table-column-header'
import Image from 'next/image'
import { DataTableRowActions } from '../../data-table-row-actions'
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from 'dayjs'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
dayjs.extend(relativeTime)

const columnHelper = createColumnHelper<CUSTOMER>()


const ActionButton = (props: {row: Row<CUSTOMER & { created_at: Date, updated_at: Date } >}) => {
    const { row } = props
    const { query } = useRouter()

    console.log(row.id)
    return (
        <div className="flex flex-row items-center justify-center">
                <Link legacyBehavior href={`/dashboard/${query.store_id}/customers/${row.getValue("id")}"}`}  >
                    <button className=" group border-none rounded-full p-2 hover:bg-gray-200 ">
                        <ArrowRight 
                            className={`text-gray-400 group-hover:text-black`}
                            size="16px"
                        />
                    </button>
                </Link>
            </div>
    )
}




const CustomerColumns: ColumnDef<CUSTOMER & { created_at: Date, updated_at: Date } >[] = [

    {
        id: "Name",
        header: "Name",
        accessorFn: row => `${row.first_name ?? ""} ${row.last_name ?? ""}`,
        enableSorting: false,
    },
    {
        accessorKey: "email",
        header: ({column}) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({row}) => <span className="text-sm font-medium text-left">{row.getValue("email")}</span>,
        enableSorting: false
    },
    {
        accessorKey: "created_at",
        header: ({column}) => <DataTableColumnHeader column={column} title="Since" />,
        cell: ({row}) => <span className='text-sm font-medium text-left' > {dayjs(row.getValue("created_at"))?.fromNow()} </span>
    },
    {
        id: "actions",
        cell: ({row}) => (
            <ActionButton row={row} />
        )
    }
]


export const CustomerPaymentMethodsColumns: ColumnDef<PAYMENT_METHOD>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({row}) => row.getValue("id")
    },
    {
        accessorKey: "phone_number",
        header: "Phone Number",
        cell: ({row}) => row.getValue("phone_number")
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({row}) => row.getValue("type")
    }
]


export default CustomerColumns