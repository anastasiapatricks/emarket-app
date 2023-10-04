import { useEffect, useMemo, useState } from "react"
import { Button, Container, Pagination, Table } from "react-bootstrap"
import { Order } from "../models/OrderReqResp"
import { useOrderService } from "../hooks/useOrderService"
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"

export const AdminOrders = () => {
    const [data, setData] = useState<Order[]>([])
    const orderService = useOrderService()

    // TODO Update delivery status
    const handleButtonClick = async () => {
        refreshData()
    }

    const refreshData = async () => {
        const products = await orderService.getAll()
        setData(products)
    }

    useEffect(() => {
        refreshData()
    }, [])

    return <Container>
        <Button onClick={handleButtonClick}>Refresh</Button>
        <OrderTable data={data} />
    </Container>
}

interface OrderTableProps {
    data: Order[]
}

const OrderTable = ({ data }: OrderTableProps) => {
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => 'ID',
        }),
        columnHelper.accessor('items', {
            header: () => 'Product: Qty',
            cell: info => info.getValue().map(item => `${item.name}: ${item.quantity}`).join(', ')
        }),
        columnHelper.accessor('totalPrice', {
            header: () => 'Total Price',
        }),
        columnHelper.accessor('userId', {
            header: () => 'User ID' ,
        }),
        columnHelper.accessor('address', {
            header: () => 'Address',
        }),
        columnHelper.accessor('createdTimestamp', {
            header: () => 'Created Timestamp',
        }),
        columnHelper.accessor('date', {
            header: () => 'Delivery Date',
        }),
        columnHelper.accessor('timeslot', {
            header: () => 'Delivery Timeslot',
        }),
        columnHelper.accessor('deliveryStatus', {
            header: () => 'Delivery Status',
        }),
    ], [])

    const table = useReactTable<Order>({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10
            }
        }
    })

    return (
        <>
            <Table hover>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.First onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} />
                <Pagination.Prev onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
                <Pagination.Item>{table.getState().pagination.pageIndex + 1}</Pagination.Item>
                <Pagination.Next onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
                <Pagination.Last onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} />
            </Pagination>
        </>
    )
}

const columnHelper = createColumnHelper<Order>()
