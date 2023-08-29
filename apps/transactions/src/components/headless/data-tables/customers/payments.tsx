import { ColumnDef, Row, createColumnHelper } from '@tanstack/react-table'
import { CUSTOMER, PAYMENT, PRODUCT } from 'zodiac'
import { DataTableColumnHeader } from '../../data-table-column-header'
import Image from 'next/image'
import { DataTableRowActions } from '../../data-table-row-actions'
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from 'dayjs'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
dayjs.extend(relativeTime)




const CustomerPaymentColumns: ColumnDef<PAYMENT & { created_at: Date, updated_at: Date } >[] = [
    {
        id: "payment_method_id",
        accessorKey: 'payment_method_id',
        header: "Payment Method",
        cell: ({row}) => row.getValue("payment_method_id")
    },
    {
        id: "amount",
        accessorKey: 'amount',
        header: ({column}) => <DataTableColumnHeader column={column} title="Amount" />,
        cell: ({row}) => row.getValue("amount")
    },
    {   
        id: "status",
        accessorKey: 'status',
        cell: ({row}) => row.getValue("status")

    }
]


export default CustomerPaymentColumns