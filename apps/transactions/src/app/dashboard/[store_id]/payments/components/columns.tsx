
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from 'dayjs'
import { ColumnDef } from "@tanstack/react-table"
import { PAYMENT } from "zodiac"
import { DataTableColumnHeader } from "@/components/headless/data-table-column-header"
dayjs.extend(relativeTime)


const StorePaymentColumns: ColumnDef<PAYMENT & { created_at: Date, updated_at: Date } >[] = [
    {
        id: "created_at",
        accessorKey: "created_at",
        header: ({column}) => <DataTableColumnHeader column={column} title="Paid On" />,
        cell: ({row}) => dayjs(row.getValue("amount")).format("MMM dd")
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


export default StorePaymentColumns