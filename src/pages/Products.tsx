// Products.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Form } from 'react-bootstrap';
import { useUserAuth } from "../hooks/useUserAuth"
import { useProductService } from "../hooks/useProductService"
import { Product } from "../models/ProductReqResp"
import { User } from "../models/User.ts";
import { cartService } from "../services/CartService.ts";
import { InputItemCart } from "../models/CartReqResp.ts";


interface ProductsProps {
  productsPerPage: number;
}

export const Products: React.FC<ProductsProps> = ({ productsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState('')

  const { user } = useUserAuth()
  const ProductService = useProductService()
  const CartService = cartService()

  const refreshData = async () => {
    if (user?.id) {
      const products = await ProductService.getAll()
      setProducts(products)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const filteredProducts = products.filter(p => keyword == '' ? true : p.productName.toLowerCase().includes(keyword.toLowerCase()) || p.description.toLowerCase().includes(keyword.toLowerCase()))

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const goToFirstPage = () => {
    paginate(1);
  };

  const goToLastPage = () => {
    paginate(totalPages);
  };

  const goToPreviousPage = () => {
    paginate(currentPage - 1);
  };

  const goToNextPage = () => {
    paginate(currentPage + 1);
  };

  const addProductToCart = async (product: Product, user: User | null) => {
    if (user != null) {
      console.log(user)
      console.log(product)
      const newCart: InputItemCart = {
        productId: product.id,
        quantity: 1,
      }
      const res = await CartService.createNewCart(user.id.toString(), newCart);
      console.log(res);
    }

  };


  return (
    <Container>
      <h1 className='my-3'>Product Catalogue</h1>

      <Form>
        <Form.Group className="mb-3" controlId="keyword">
          <Form.Label>Search Products</Form.Label>
          <Form.Control name="keyword" type="text" placeholder="Enter keyword here..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        </Form.Group>
      </Form>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {currentProducts.map((product) => {
          if (currentProducts.length === 0) {
            return (
              <p>No Records Found</p>
            );
          } else {
            return (
              <Card style={{
                width: '18rem',
                marginRight: '2rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                <Card.Img variant="top" src="holder.js/100px180" onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg";
                }} />
                <Card.Body>
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text>
                    {product.description}
                  </Card.Text>
                  <Card.Text>${product.price.toFixed(2)}</Card.Text>
                  <Button onClick={() => {
                    addProductToCart(product, user)
                  }}>Add To Cart
                  </Button>
                </Card.Body>
              </Card>
            );
          }
        })}
      </div>
      <div>
        {filteredProducts.length > productsPerPage && (
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <Button className="page-link" onClick={goToFirstPage}>
                {"<<"}
              </Button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <Button className="page-link" onClick={goToPreviousPage}>
                {"<<"}
              </Button>
            </li>
            {Array.from({ length: totalPages }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <Button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </Button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <Button className="page-link" onClick={goToNextPage}>
                {">"}
              </Button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <Button className="page-link" onClick={goToLastPage}>
                {">>"}
              </Button>
            </li>
          </ul>
        )}
      </div>
    </Container>
  );
};
