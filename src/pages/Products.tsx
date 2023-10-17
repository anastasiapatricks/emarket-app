// Products.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import { useUserAuth } from "../hooks/useUserAuth"
import { useProductService } from "../hooks/useProductService"
import { Product } from "../models/ProductReqResp"


interface ProductsProps {
  productsPerPage: number;
}

export const Products: React.FC<ProductsProps> = ({ productsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);

  const { user } = useUserAuth()
  const ProductService = useProductService()

  const refreshData = async () => {
        if (user?.id) {
            const products = await ProductService.getAll()
            setProducts(products)
        }
    }

    useEffect(() => {
        refreshData()
    }, [])

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

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


  return (
    <Container>
        <h1 className='my-3'>Product Catalogue</h1>
        <div style={{ display:'flex', flexWrap: 'wrap' }}>
        {currentProducts.map((product) => {
            if (products.length === 0) {
                return(
                    <p>No Records Found</p>
                );
            } else {
                return (
                    <Card style={{ width: '18rem', marginRight:'2rem', marginBottom: '1rem', textAlign: 'center'}}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                      <Card.Title>{product.productName}</Card.Title>
                      <Card.Text>
                        {product.description}
                      </Card.Text>
                      <Card.Text>${product.price.toFixed(2)}</Card.Text>
                      <button>Add To Cart</button>
                    </Card.Body>
                  </Card>
                );
            }
        })}
        </div>
        <div>
        {products.length > productsPerPage && (
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
