import { Button, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

export const CheckoutSuccess = () => {
    return (
        <Container>
            <h1 style={{ display: 'flex', justifyContent: 'center' }} className="mt-5 center">Order Placed Successfully!</h1>
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