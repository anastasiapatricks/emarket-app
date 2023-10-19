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
        <div className="row">
          <div className="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Home</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Features</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Pricing</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">FAQs</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">About</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Home</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Features</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Pricing</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">FAQs</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">About</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Home</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Features</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Pricing</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">FAQs</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">About</a></li>
            </ul>
          </div>

          <div className="col-md-5 offset-md-1 mb-3">
            <form>
              <h5>Subscribe to our newsletter</h5>
              <p>Monthly digest of what's new and exciting from us.</p>
              <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                <input id="newsletter1" type="text" className="form-control" placeholder="Email address" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
          <p>&copy; 2023 EcoHarvest, Inc.</p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3"><a className="link-dark" href="#">sss</a></li>
            <li className="ms-3"><a className="link-dark" href="#">sss</a></li>
            <li className="ms-3"><a className="link-dark" href="#">sss</a></li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}