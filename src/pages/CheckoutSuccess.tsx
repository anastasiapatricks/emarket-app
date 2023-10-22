import { createColumnHelper, getCoreRowModel } from "@tanstack/table-core"
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { flexRender, useReactTable } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useUserAuth } from "../hooks/useUserAuth"
import { useOrderService } from "../hooks/useOrderService"
import moment from "moment"

interface OrderItems {
    productId: string,
    name: string,
    description: string,
    price: number,
    quantity: number,
    subtotal: number,
}

export const CheckoutSuccess = () => {
    const { id } = useParams();
    const { user } = useUserAuth()
    const orderService = useOrderService()
    const [data, setData] = useState<any>()

    const refreshData = async () => {
        let orderNo = 0;

        if (id) {
            orderNo = parseInt(id);
        }

        if (user?.id) {
            const order = await orderService.get(orderNo)
            setData(order)
        }
    }

    useEffect(() => {
        refreshData()
    }, [orderService])

    const [orderItems, setOrderItems] = useState<OrderItems[]>([]);

    const getOrderItems = () => {
        if (data && data.items) {
            setOrderItems(
                data.items.map((item: { productId: any; name: any; description: any; price: number; quantity: number }) => ({
                    productId: item.productId,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: parseFloat((item.price * item.quantity).toFixed(2)),
                }))
            )
        }
    }

    useEffect(() => {
        getOrderItems();
    }, [data])

    console.log(orderItems);

    return (
        <Container>
            <h1 style={{ display: 'flex' }} className="mt-5">Order# {id} Placed Successfully!</h1>
            <br />
            <Card>
                <Card.Body>
                    <OrderTable data={orderItems} />
                    <div className="divider" />
                    <div className="total-label flex-row-reverse">Total:
                        ${(orderItems.reduce((acc, product) => acc + product.subtotal, 0)).toFixed(2)}</div>
                </Card.Body>
            </Card>
            <br />
            <Card>
                <Card.Body>
                    <h4>Delivery Details</h4>

                    <Row>
                        <Col md={4}>
                            Delivery Status:
                        </Col>
                        <Col md={8}>
                            {data && data.deliveryStatus ? data.deliveryStatus : ""}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            Delivery Address:
                        </Col>
                        <Col md={8}>
                            {data && data.address ? data.address : ""}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            Delivery Date:
                        </Col>
                        <Col md={8}>
                            {data && data.date ? moment(data.date).format('DD MMM YYYY') : ""}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            Delivery Timeslot:
                        </Col>
                        <Col md={8}>
                            {data && data.timeslot ? data.timeslot : ""}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <br />
            <Link to="/user/products">
                <Button style={{
                    display: 'block',
                    margin: '0 auto',
                }}
                    variant="primary">
                    Back to Home
                </Button>
            </Link>
        </Container>
    )
}

interface OrderTableProps {
    data: OrderItems[]
}

const OrderTable = ({ data }: OrderTableProps) => {
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: () => 'Product Name',
            cell: (info) => (
                <div>
                    <img
                        src={`/img/products/${info.row.original.name.toLowerCase()}.jpg`}
                        alt={info.row.original.name}
                        width="50"
                        height="50"
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {info.row.original.name}
                </div>
            ),
        }),
        columnHelper.accessor('description', {
            header: () => 'Description',
        }),
        columnHelper.accessor('price', {
            header: () => 'Price',
        }),
        columnHelper.accessor('quantity', {
            header: () => 'Quantity',
        }),
        columnHelper.accessor('subtotal', {
            header: () => 'Subtotal',
        }),
    ], [])

    const table = useReactTable<OrderItems>({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
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
        </>
    )
}

const columnHelper = createColumnHelper<OrderItems>()