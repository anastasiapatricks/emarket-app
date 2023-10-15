import { Button, Card, Container, Form, InputGroup } from "react-bootstrap"
import { Product } from "../models/ProductReqResp"
import { useCallback, useEffect, useState } from "react"
import { useProductService } from "../hooks/useProductService"

import './Cart.css'

export const Cart = () => {
  return <Container>
    <h1 className="mt-5">My cart</h1>
    <ViewCart />
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

const MockCart: Cart = {
  cartId: "",
  userId: "",
  productIds: ["651002443d9df20412b9a2cf", "651003533d9df20412b9a2d1", "651004a33d9df20412b9a2d5"],
  quantities: [1, 2, 3],
  createdDate: new Date(),
  updatedDate: new Date(),
  status: "empty"
}

const ViewCart = () => {
  const [productCounts, setProductCounts] = useState<ProductCount[]>([])
  const productService = useProductService()

  const refreshProductCounts = useCallback(async () => {
    const cart: Cart = MockCart
    const productCounts = await Promise.all(cart.productIds.map(async (id, i): Promise<ProductCount> => ({
      product: await productService.get(id),
      quantity: cart.quantities[i]
    })))
    setProductCounts(productCounts)
  }, [productService])

  useEffect(() => {
    refreshProductCounts()
  }, [refreshProductCounts])

  return (
    <Card className="shadow-sm mt-4 p-3">
      <Card.Body>
        <h2 className="mb-3">Added Items</h2>
        <ProductList productCounts={productCounts} onSetProductCounts={setProductCounts} />
        <div className="d-flex flex-row-reverse">
          <Button variant="primary">Checkout</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

interface ProductListProps {
  productCounts: ProductCount[]
  onSetProductCounts: (pq: ProductCount[]) => void
}

interface ProductCount {
  product: Product
  quantity: number
}

const ProductList = ({ productCounts, onSetProductCounts }: ProductListProps) => {
  const handleSetQuantity = (productId: string, quantity: number) => {
    const newProductCounts = productCounts.map(pq => {
      if (pq.product.id != productId) {
        return pq
      }
      return {
        product: pq.product,
        quantity: Math.max(quantity, 1)
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

    {productCounts.map(({ product, quantity }) => (
      <ProductRow
        key={product.id}
        product={product}
        quantity={quantity}
        onSetQuantity={handleSetQuantity}
      />
    ))}

    <div className="divider" />
    <div className="total-label">Total:</div>
    <div className="total-value">${productCounts.reduce((total, pq) => total + pq.product.price * pq.quantity, 0).toFixed(2)}</div>
  </div>
}

interface ProductRowProps {
  product: Product
  quantity: number
  onSetQuantity: (productId: string, q: number) => void
}

const ProductRow = ({ product, quantity, onSetQuantity }: ProductRowProps) => {
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
        <Button variant="outline-secondary" disabled={quantity <= 1} onClick={() => onSetQuantity(product.id, quantity - 1)}>-</Button>
        <Form.Control value={quantity} readOnly />
        <Button variant="outline-secondary" onClick={() => onSetQuantity(product.id, quantity + 1)}>+</Button>
      </InputGroup>
    </div>
    <div className="subtotal-col">
      ${(product.price * quantity).toFixed(2)}
    </div>
  </>
}