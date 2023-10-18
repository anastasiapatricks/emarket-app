import { Alert, Button, Card, Container, Form, Table } from "react-bootstrap"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
// import { newOrderService } from "../services/OrderService"
import { DeliveryOrderRequest, ItemRequest } from "../models/OrderReqResp"
import { useProductService } from "../hooks/useProductService"
import { Product } from "../models/ProductReqResp"
import { useUserAuth } from "../hooks/useUserAuth"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

interface OrderItems {
    id: string,
    productName: string,
    productDesc: string,
    productPrice: number,
    productQty: number,
    productSubtotal: number,
}

interface Cart {
    cartId: string
    userId: string
    productIds: string[]
    quantities: number[]
    createdDate: Date
    updatedDate: Date
    status: string
}

const MockCart: Cart = {
    cartId: "1",
    userId: "7",
    productIds: ["652e95911581362133f17092", "652e95a41581362133f17093", "652e96111581362133f1709a"],
    quantities: [3, 5, 6],
    createdDate: new Date(),
    updatedDate: new Date(),
    status: "Active"
}

const timeslot = [
    { id: '0', time: '' },
    { id: '1', time: '12.00 PM - 13.00 PM' },
    { id: '2', time: '13.00 PM - 14.00 PM' },
    { id: '3', time: '14.00 PM - 15.00 PM' },
    { id: '4', time: '15.00 PM - 16.00 PM' },
    { id: '5', time: '16.00 PM - 17.00 PM' },
    { id: '6', time: '17.00 PM - 18.00 PM' },
    { id: '7', time: '18.00 PM - 19.00 PM' },
]

export const Checkout = () => {
    const navigate = useNavigate()

    const { user } = useUserAuth()
    // const orderService = newOrderService()
    const productService = useProductService()

    const getUser = localStorage.getItem('user');
    const userData = getUser ? JSON.parse(getUser) : null;

    const [products, setProducts] = useState<Product[]>([]);
    const [errorMsg] = useState<string | null>(null)
    // const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const itemRequest: ItemRequest[] = [];

    const refreshData = async () => {
        if (user?.id) {
            const products = await productService.getAll()
            setProducts(products)
        }
    }

    useEffect(() => {
        refreshData()
    }, [productService])

    for (let i = 0; i < MockCart.productIds.length; i++) {
        const item: ItemRequest = {
            productId: MockCart.productIds[i],
            quantity: MockCart.quantities[i]
        };
        itemRequest.push(item);
    }

    const [formData, setFormData] = useState<DeliveryOrderRequest>({
        userId: userData ? userData.id : 0,
        items: itemRequest,
        date: new Date(),
        timeslot: '',
        address: ''
    })

    const orderItems: OrderItems[] = products.map((product) => {
        const productIndex = MockCart.productIds.indexOf(product.id);

        if (productIndex !== -1) {
            const productPrice = product.price;
            const productQty = MockCart.quantities[productIndex];
            const productSubtotal = (productQty * productPrice);

            return {
                id: product.id,
                productName: product.productName,
                productDesc: product.description,
                productPrice: productPrice,
                productQty: productQty,
                productSubtotal
            };
        }

        return {
            id: "",
            productName: "",
            productDesc: "",
            productPrice: 0,
            productQty: 0,
            productSubtotal: 0
        };

    }).filter((item) => item.productQty !== 0);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // try {
        //     await orderService.create(formData)
        // } catch (error) {
        //     setErrorMsg((error as Error).message)
        //     throw error
        // }

        navigate('/user/checkout/success', {
            state: {
                register: true
            }
        })
    }

    console.log(formData);
    console.log(orderItems);

    return (
        <Container>
            <h1 className="mt-5">Checkout</h1>
            <Form onSubmit={handleSubmit}>
                <Card className="shadow-sm mt-4 p-3">
                    <Card.Body>
                        <h2 className="mb-3">Delivery Details</h2>
                        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Timeslot</Form.Label>
                            <Form.Select
                                name="timeslot"
                                value={formData.timeslot}
                                onChange={handleSelectChange}
                                required
                            >
                                {timeslot.map((option: any, index: number) => (
                                    <option key={index} value={option.time}>
                                        {option.time}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Card.Body>
                </Card>

                <Card className="shadow-sm mt-4 p-3">
                    <Card.Body>
                        <h2 className="mb-3">Order Details</h2>
                        <OrderTable data={orderItems} />
                        <div className="divider" />
                        <div className="total-label flex-row-reverse">Total: ${orderItems.reduce((acc, product) => acc + product.productSubtotal, 0)}</div>
                    </Card.Body>
                </Card>
                <br />
                <div className="d-flex flex-row-reverse">
                    <Button variant="primary" type="submit">
                        Confirm Order
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

interface OrderTableProps {
    data: OrderItems[]
}

const OrderTable = ({ data }: OrderTableProps) => {
    const columns = useMemo(() => [
        columnHelper.accessor('productName', {
            header: () => 'Product Name',
        }),
        columnHelper.accessor('productDesc', {
            header: () => 'Product Description',
        }),
        columnHelper.accessor('productPrice', {
            header: () => 'Product Price',
        }),
        columnHelper.accessor('productQty', {
            header: () => 'Product Quantity',
        }),
        columnHelper.accessor('productSubtotal', {
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


