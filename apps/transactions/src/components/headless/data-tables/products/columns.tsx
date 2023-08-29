import { ColumnDef, Row } from '@tanstack/react-table'
import { PRODUCT } from 'zodiac'
import { DataTableColumnHeader } from '../../data-table-column-header'
import Image from 'next/image'
import { DataTableRowActions } from '../../data-table-row-actions'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ActionButton = (props: {row: Row<PRODUCT & { created_at: Date, updated_at: Date } >}) => {
    const { row } = props
    const { query } = useRouter()

    console.log(row.id)
    return (
        <div className="flex flex-row items-center justify-center">
                <Link legacyBehavior href={`/dashboard/${query.store_id}/products/${row.getValue("id")}"}`}  >
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


const ProductColumns: ColumnDef<PRODUCT & { created_at: Date, updated_at: Date } >[] = [
    {
        accessorKey: "image",
        header: ({column}) => {
            return <DataTableColumnHeader column={column} title="Product" />
        },
        cell: ({row}) => (
            <div className="flex flex-row items-center justify-center relative rounded-md overflow-hidden w-10 h-10">
                <Image
                    src={row.getValue("image")}
                    alt={row.getValue("id")}
                    fill
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </div>
        ),
        enableSorting: false
    },
    // {
    //     accessorKey: "id",
    //     header: ({column})=> (
    //         <DataTableColumnHeader column={column} title="Product" />
    //     ),
    //     cell: ({row}) => <span className="text-sm font-medium text-left">
    //         {row.getValue("id")}
    //     </span>,
    //     enableSorting: false,
    // },
    {
        accessorKey: "name",
        header: ({column}) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({row}) => <span className="text-sm font-medium text-left">{row.getValue("name")}</span>,
        enableSorting: false
    },
    {
        accessorKey: "price",
        header: ({column}) => <DataTableColumnHeader column={column} title="Price" />,
        cell: ({row}) => <span className='text-sm font-medium text-left' > {row.getValue("price")} </span>
    },
    {
        id: "actions",
        cell: ({row }) => {
        return (
            <>
                <ActionButton
                    row={row}
                />
            </>
        )}
    }
]


export default ProductColumns