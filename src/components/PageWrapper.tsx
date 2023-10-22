import { Container, Nav, Navbar } from "react-bootstrap"
import { Link, Outlet } from "react-router-dom"
import { useUserAuth } from "../hooks/useUserAuth"

import "./PageWrapper.css"

export const PageWrapper = () => {
  return (
    <div className="page-container">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

const Header = () => {
  const { user, logout } = useUserAuth()

  return (
    <Navbar expand="lg" className="bg-white shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to='/'>
          <img 
            src="/ecoharvest.svg"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />
          EcoHarvest
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            {user && !user.isAdmin && (
              <>
                <Nav.Link as={Link} to="/user/products">Products</Nav.Link>
                <Nav.Link as={Link} to="/user/orders">Orders</Nav.Link>
              </>
            )}
            {user && user.isAdmin && (
              <>
                <Nav.Link as={Link} to="/admin/products">Manage Products</Nav.Link>
                <Nav.Link as={Link} to="/admin/orders">Manage Orders</Nav.Link>
                <Nav.Link as={Link} to="/admin/inventory">Manage Inventory</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                {!user.isAdmin && (
                  <Nav.Link as={Link} to="/user/cart">My Cart</Nav.Link>
                )}
                <Nav.Link onClick={logout}>Log Out</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Log In</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  )
}

const Footer = () => {
  return (
    <footer className="pt-5">
      <Container>
        <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
          <p>&copy; 2023 EcoHarvest, Inc.</p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3"><a className="link-dark" href="#">About Us</a></li>
            <li className="ms-3"><a className="link-dark" href="#">Contact Us</a></li>
            <li className="ms-3"><a className="link-dark" href="#">Privacy</a></li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}