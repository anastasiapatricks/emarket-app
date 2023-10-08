import { useEffect, useMemo, useState } from "react"
import { Button, Container, Pagination, Table } from "react-bootstrap"
import { Order } from "../models/OrderReqResp"
import { useOrderService } from "../hooks/useOrderService"
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import moment from 'moment';

export const AdminOrders = () => {
    const orderService = useOrderService()
    const [data, setData] = useState<Order[]>([])

    const handleButtonClick = async () => {
        refreshData()
    }

    const refreshData = async () => {
        const products = await orderService.getAll()
        setData(products)
    }
    
    const handleUpdateStatus = async (id: number, newStatus: string) => {
        await orderService.updateStatus(id, newStatus)
        await refreshData()
    }

    const rowActions: OrderRowActions = {
        onUpdateStatus(id, newStatus) {
            handleUpdateStatus(id, newStatus)
        }
    }

    useEffect(() => {
        refreshData()
    }, [])

    return <Container>
        <h1 className="my-3">Orders</h1>
        <Button onClick={handleButtonClick}>Refresh</Button>
        <OrderTable data={data} rowActions={rowActions} />
    </Container>
}

interface OrderTableProps {
    data: Order[]
    rowActions: OrderRowActions
}

interface OrderRowActions {
    onUpdateStatus(id: number, newStatus: string): void
}

const OrderTable = ({ data, rowActions }: OrderTableProps) => {
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
            cell: info  => '$' + info.getValue().toFixed(2)
        }),
        columnHelper.accessor('userId', {
            header: () => 'User ID' ,
        }),
        columnHelper.accessor('address', {
            header: () => 'Address',
        }),
        columnHelper.accessor('createdTimestamp', {
            header: () => 'Created Timestamp',
            cell: info  => moment.unix(info.getValue()).format('DD MMM YYYY HH:mm')
        }),
        columnHelper.accessor('date', {
            header: () => 'Delivery Date',
            cell: info  => moment(info.getValue()).format('DD MMM YYYY')
        }),
        columnHelper.accessor('timeslot', {
            header: () => 'Delivery Timeslot',
        }),
        columnHelper.accessor('deliveryStatus', {
            header: () => 'Delivery Status',
        }),
        columnHelper.display({
            id: 'actions',
            header: () => 'Actions',
            cell: ({ row }) => <span>
                <Button onClick={() => rowActions.onUpdateStatus(row.original.id, "SCHEDULED")}>Mark as Scheduled</Button>
                <Button onClick={() => rowActions.onUpdateStatus(row.original.id, "DELIVERED")}>Mark as Delivered</Button>
            </span>
        })
    ], [rowActions])

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
