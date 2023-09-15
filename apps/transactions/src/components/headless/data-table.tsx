/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  TableState,
  Updater,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/headless/table-ui"

import { DataTablePagination } from "./data-table-pagination"
import { CogIcon } from "lucide-react"
import { isFunction } from "lodash"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onPaginationStateChanged?: (pagination: PaginationState) => void
  loading?: boolean
  onStateChanged?: (state: TableState) => void
  state?: TableState
  paginationEnabled?: boolean
  error?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onPaginationStateChanged,
  loading,
  onStateChanged,
  state,
  paginationEnabled,
  error
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState(state?.rowSelection ?? {})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(state?.columnVisibility ?? {})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>(state?.sorting ?? [])
  const [pagination, setPagination] = React.useState<PaginationState>(state?.pagination ?? {pageIndex: 0, pageSize: 10})

  React.useEffect(()=>{
    onPaginationStateChanged?.(pagination)
  }, [pagination.pageIndex, pagination.pageSize])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative" >
            {
              loading && <div className=" absolute flex flex-row w-full h-full items-center justify-center bg-slate-100 opacity-80">
                <CogIcon className="animate-spin" />
              </div>
            }
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {
                    error ? "Oops!! Something went wrong." : "No results."
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginationEnabled !== false && <DataTablePagination  table={table} />}
    </div>
  )
}