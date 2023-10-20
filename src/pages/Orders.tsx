import { Container, Pagination, Table } from "react-bootstrap"
import { useOrderService } from "../hooks/useOrderService"
import { useEffect, useMemo, useState } from "react"
import { Order } from "../models/OrderReqResp"
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import moment from 'moment';
import { useUserAuth } from "../hooks/useUserAuth"

export const Orders = () => {
    const { user } = useUserAuth()
    const orderService = useOrderService()
    const [data, setData] = useState<Order[]>([])

    const refreshData = async () => {
        if (user?.id) {
            const products = await orderService.getAllByUserId(user.id)
            setData(products)
        }
    }

    useEffect(() => {
        refreshData()
    }, [orderService])

    return <Container>
        <h1 className="my-3">My Orders</h1>
        <OrderTable data={data} />
    </Container>
}

interface OrderTableProps {
    data: Order[]
}


const OrderTable = ({ data }: OrderTableProps) => {
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => 'Order ID',
        }),
        columnHelper.accessor('items', {
            header: () => 'Product: Qty',
            cell: info => info.getValue().map(item => `${item.name}: ${item.quantity}`).join(', ')
        }),
        columnHelper.accessor('totalPrice', {
            header: () => 'Total Price',
            cell: info => '$' + info.getValue().toFixed(2)
        }),
        columnHelper.accessor('address', {
            header: () => 'Address',
        }),
        columnHelper.accessor('createdTimestamp', {
            header: () => 'Created Timestamp',
            cell: info => moment.unix(info.getValue()).format('DD MMM YYYY HH:mm')
        }),
        columnHelper.accessor('date', {
            header: () => 'Delivery Date',
            cell: info => moment(info.getValue()).format('DD MMM YYYY')
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
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>No records found</td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        )))}
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
