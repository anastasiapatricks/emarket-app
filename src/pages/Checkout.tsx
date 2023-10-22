import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { newOrderService } from "../services/OrderService"
import { DeliveryOrderRequest, ItemRequest } from "../models/OrderReqResp"
import { useProductService } from "../hooks/useProductService"
import { Product } from "../models/ProductReqResp"
import { useUserAuth } from "../hooks/useUserAuth"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import LoadingModal from "../components/Loading/LoadingModal"
import { CartItem } from "../models/CartReqResp.ts";
import { cartService } from "../services/CartService.ts";

interface OrderItems {
    id: string,
    productName: string,
    productDesc: string,
    productPrice: number,
    productQty: number,
    productSubtotal: number,
}

interface Payment {
    creditCardNumber: string,
    cvvCode: string,
    expiryDate: string,
    creditCardName: string,
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
    const today = new Date()

    const { user } = useUserAuth()
    const orderService = newOrderService()
    const productService = useProductService()
    const CartService = cartService()

    const getUser = localStorage.getItem('user');
    const userData = getUser ? JSON.parse(getUser) : null;

    const [products, setProducts] = useState<Product[]>([]);
    const [userCart, setUserCart] = useState<CartItem[]>([])
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        if (user != null) {
            const products = await productService.getAll()

            const res = await CartService.getUserCart(user.id.toString())
            setUserCart(res)
            setProducts(products)
        }
    }

    useEffect(() => {
        refreshData()
    }, [productService])

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const [itemRequest, setItemRequest] = useState<ItemRequest[]>([]);

    useEffect(() => {
        updateItems();
    }, [userCart])

    const updateItems = () => {
        setItemRequest(userCart.map(product => ({
            productId: product.productId,
            quantity: parseInt(product.quantity),
        })))
    }

    const [formData, setFormData] = useState<DeliveryOrderRequest>({
        userId: userData ? userData.id : 0,
        items: [],
        date: formatDate(today),
        timeslot: '',
        address: ''
    })

    useEffect(() => {
        setFormData({
            ...formData,
            items: itemRequest
        })
    }, [itemRequest])

    const orderItems: OrderItems[] = products.map((product) => {
        const productIndex = userCart.findIndex(obj => obj.productId == product.id);

        if (productIndex !== -1) {
            const productPrice = product.price;
            const productQty = parseInt(userCart[productIndex].quantity);
            const productSubtotal = (productQty * productPrice).toFixed(2);

            return {
                id: product.id,
                productName: product.productName,
                productDesc: product.description,
                productPrice: productPrice,
                productQty: productQty,
                productSubtotal: parseFloat(productSubtotal)
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

    const [paymentData, setPaymentData] = useState<Payment>({
        creditCardNumber: "",
        cvvCode: "",
        expiryDate: "",
        creditCardName: ""
    })

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

    const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentData({
            ...paymentData,
            [name]: value,
        });
    };

    const handleCreditCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const replaced = value.replace(/[^\d-]/g, '');
        const formattedValue = replaced.replace(/-/g, '').match(/.{1,4}/g);
        const formattedCreditCardNumber = formattedValue ? formattedValue.join('-') : '';

        setPaymentData({
            ...paymentData,
            [name]: formattedCreditCardNumber,
        });
    };

    const handleCvvCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const replaced = value.replace(/\D/g, '');

        setPaymentData({
            ...paymentData,
            [name]: replaced,
        });
    };

    const handleExpiryDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const replaced = value.replace(/\D/g, '');

        if (replaced.length <= 2) {
            setPaymentData({
                ...paymentData,
                [name]: replaced,
            });
        } else if (replaced.length <= 4) {
            const formattedValue = `${replaced.slice(0, 2)}/${replaced.slice(2)}`;

            setPaymentData({
                ...paymentData,
                [name]: formattedValue,
            });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formData.items && formData.items.length !== 0) {
            setIsLoading(true);

            try {
                const response: any = await orderService.create(formData, isLoading, setIsLoading);

                if (response) {
                    deleteCart();

                    navigate(`${'/user/checkout/success/orderNo/'}${response.id}`, {
                        state: {
                            register: true
                        }
                    })
                } else {
                    setErrorMsg("Unable to checkout")
                }
            } catch (error) {
                setErrorMsg((error as Error).message)
                throw error
            }
        } else {
            setErrorMsg("Please add at least one item to cart")
        }
    }

    const deleteCart = async () => {
        for (const cart of userCart) {
            if (user !== null) {
                try {
                    await CartService.deleteCartById(user.id.toString(), cart.cartId);
                } catch (error) {
                    console.error(`Failed to delete cart with cart_id: ${cart.cartId}`);
                }
            }
        }
    }

    console.log(formData);

    return (
        <Container>
            {isLoading && (<LoadingModal />)}
            <h1 className="mt-5">Checkout</h1>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Card className="shadow-sm mt-4 p-3">
                    <Card.Body>
                        <h2 className="mb-3">Delivery</h2>
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
                        <h2 className="mb-3">Products Ordered</h2>
                        <OrderTable data={orderItems} />
                        <div className="divider" />
                        <div className="total-label flex-row-reverse">Total:
                            ${(orderItems.reduce((acc, product) => acc + product.productSubtotal, 0)).toFixed(2)}</div>
                    </Card.Body>
                </Card>

                <Card className="shadow-sm mt-4 p-3">
                    <Card.Body>
                        <h2 className="mb-3">Payment</h2>
                        <Form.Group className="mb-3" controlId="creditCardNumber">
                            <Form.Label>Credit Card Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="creditCardNumber"
                                value={paymentData.creditCardNumber}
                                onChange={handleCreditCardNumberChange}
                                minLength={19}
                                maxLength={19}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="cvvCode">
                                    <Form.Label>CVV Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cvvCode"
                                        value={paymentData.cvvCode}
                                        onChange={handleCvvCodeChange}
                                        minLength={3}
                                        maxLength={3}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="expiryDate">
                                    <Form.Label>Expiry Date</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expiryDate"
                                        value={paymentData.expiryDate}
                                        onChange={handleExpiryDateChange}
                                        minLength={5}
                                        maxLength={5}
                                        placeholder="MM/YY"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="creditCardName">
                            <Form.Label>Name on Card</Form.Label>
                            <Form.Control
                                type="text"
                                name="creditCardName"
                                value={paymentData.creditCardName}
                                onChange={handlePaymentChange}
                                required
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>

                <br />
                <div className="d-flex flex-row-reverse">
                    <Button variant="primary" type="submit">
                        Place Order
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
            cell: (info) => (
                <div>
                    <img
                        src={`/img/products/${info.row.original.productName.toLowerCase()}.jpg`}
                        alt={info.row.original.productName}
                        width="50"
                        height="50"
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {info.row.original.productName}
                </div>
            ),
        }),
        columnHelper.accessor('productDesc', {
            header: () => 'Description',
        }),
        columnHelper.accessor('productPrice', {
            header: () => 'Price',
        }),
        columnHelper.accessor('productQty', {
            header: () => 'Quantity',
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


