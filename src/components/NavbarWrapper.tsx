import { Container, Nav, Navbar } from "react-bootstrap"
import { Link, Outlet } from "react-router-dom"
import { useUserAuth } from "../hooks/useUserAuth"

export const NavbarWrapper = () => {
  return (
    <>
      <header>
        <NavbarWithUser />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

const NavbarWithUser = () => {
  const { user, logout } = useUserAuth()

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to='/'>EcoHarvest</Navbar.Brand>
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
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link>{user?.name}</Nav.Link>
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