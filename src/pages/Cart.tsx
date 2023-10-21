import {Button, Card, Container, Form, InputGroup, Modal} from "react-bootstrap"
import {Product} from "../models/ProductReqResp"
import {useCallback, useEffect, useState} from "react"
import {useProductService} from "../hooks/useProductService"
import {debounce} from "lodash"

import './Cart.css'
import {useNavigate} from "react-router-dom"
import {cartService} from "../services/CartService.ts";
import {useUserAuth} from "../hooks/useUserAuth.tsx";
import {CartItem, UpdateItemCart} from "../models/CartReqResp.ts";

export const Cart = () => {
    return <Container>
        <h1 className="mt-5">My cart</h1>
        <ViewCart/>
    </Container>
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

const ViewCart = () => {
    const [productCounts, setProductCounts] = useState<ProductCount[]>([])
    const [showModal, setShowModal] = useState(false);
    const [productDeleteData, setProductDeleteData] = useState<ProductCount>()
    const productService = useProductService()
    const CartService = cartService();
    const navigate = useNavigate();
    const {user} = useUserAuth()


    const handleCloseModal = () => {
        setShowModal(!showModal)
    };

    const deleteCart = async () => {
        if (productDeleteData != null && user != null) {
            CartService.deleteCartById(user.id.toString(), productDeleteData.cart.cartId).then(() => {
                setShowModal(!showModal)
                parseUserCart()
            }).catch(() => {
                console.error("Error deleting the cart")
            })

        }
    }

    const handleInitialModal = (p: ProductCount) => {
        if (p != null) {
            setProductDeleteData(p)
            console.log(p)
        }
        setShowModal(!showModal)
    };


    const parseUserCart = useCallback(async () => {
        if (user != null) {
            const user_cart = await CartService.getUserCart(user.id.toString())
            console.log(user_cart);
            const productCounts = await Promise.all(user_cart.map((async (cartItem): Promise<ProductCount> => ({
                product: await productService.get(cartItem.productId),
                quantity: parseInt(cartItem.quantity),
                cart: cartItem
            }))));
            setProductCounts(productCounts)
        } else {
            console.error("User object empty")
        }
    }, [productService, CartService, user])

    useEffect(() => {

        parseUserCart()
    }, [])

    const handleCheckoutClick = () => {
        navigate(`/user/checkout`)
    }

    const updateProductCount = (pq: ProductCount[]) => {
        setProductCounts(pq)
        updateCartAPI(pq)
    }


    const updateCartAPI = useCallback(debounce(async (pq: ProductCount[]) => {
        const data: UpdateItemCart[] = pq.map((data) => {

            const p: UpdateItemCart = {
                cartId: data.cart.cartId,
                productId: data.cart.productId,
                quantity: data.quantity,
            }
            return p
        });
        if (user != null) {
            CartService.updateCart(user.id.toString(), data).catch((e) => console.error(e))
        } else {
            console.error("user is null")
        }

    }, 1500), []);
    let showView = null
    if (productDeleteData != null) {
        showView = (
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>

                <Modal.Body>Are you sure you want to
                    delete <b>{productDeleteData?.product?.productName}</b> with <b>{productDeleteData?.quantity}</b> quantity</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteCart}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    return (
        <div>
            {showView}
            <Card className="shadow-sm mt-4 p-3">
                <Card.Body>
                    <h2 className="mb-3">Added Items</h2>
                    <ProductList productCounts={productCounts} onSetProductCounts={updateProductCount}
                                 onOpenModal={handleInitialModal}/>
                    <div className="d-flex flex-row-reverse">
                        <Button variant="primary" onClick={handleCheckoutClick}>Checkout</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

interface ProductListProps {
    productCounts: ProductCount[]
    onSetProductCounts: (pq: ProductCount[]) => void
    onOpenModal: (p: ProductCount) => void
}

interface ProductCount {
    product: Product
    quantity: number
    cart: CartItem
}

const ProductList = ({productCounts, onSetProductCounts, onOpenModal}: ProductListProps) => {


    const handleSetQuantity = (productId: string, quantity: number, cart: CartItem) => {
        const newProductCounts = productCounts.map(pq => {
            if (pq.product.id != productId) {
                return pq
            }
            return {

                product: pq.product,
                quantity: Math.max(quantity, 1),
                cart: cart
            }
        })
        onSetProductCounts(newProductCounts)
    }

    return <div className="product-list mb-3">
        <div className="header product-col">Product Name</div>
        <div className="header description-col">Description</div>
        <div className="header price-col">Price</div>
        <div className="header quantity-col">Quantity</div>
        <div className="header subtotal-col">Subtotal</div>
        <div className="header delete-col">Ops</div>


        {productCounts.map(({product, quantity, cart}) => (
            <ProductRow
                key={product.id}
                product={product}
                quantity={quantity}
                cart={cart}
                onSetQuantity={handleSetQuantity}
                onOpenModal={onOpenModal}
            />
        ))}

        <div className="divider"/>
        <div className="total-label">Total:</div>
        <div
            className="total-value">${productCounts.reduce((total, pq) => total + pq.product.price * pq.quantity, 0).toFixed(2)}</div>
    </div>
}

interface ProductRowProps {
    product: Product
    quantity: number
    cart: CartItem
    onSetQuantity: (productId: string, q: number, cart: CartItem) => void
    onOpenModal: (p: ProductCount) => void
}

const ProductRow = ({product, quantity, cart, onSetQuantity, onOpenModal}: ProductRowProps) => {
    const p: ProductCount = {
        product: product,
        quantity: quantity,
        cart: cart
    }
    return <>
        <div className="product-col">
            {product.productName}
        </div>
        <div className="description-col">
            {product.description}
        </div>
        <div className="price-col">
            ${product.price.toFixed(2)}
        </div>
        <div className="quantity-col">
            <InputGroup>
                <Button variant="outline-secondary" disabled={quantity <= 1}
                        onClick={() => onSetQuantity(product.id, quantity - 1, cart)}>-</Button>
                <Form.Control value={quantity} readOnly/>
                <Button variant="outline-secondary"
                        onClick={() => onSetQuantity(product.id, quantity + 1, cart)}>+</Button>
            </InputGroup>
        </div>
        <div className="subtotal-col">
            ${(product.price * quantity).toFixed(2)}
        </div>
        <div className="delete-col"><Button variant={"danger"} onClick={() => onOpenModal(p)}>Delete</Button></div>
    </>
}