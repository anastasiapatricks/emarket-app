import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { NavbarWrapper } from './components/NavbarWrapper'
import { RequireUserWrapper } from './components/RequireUserWrapper'
import { WithoutAuth } from './components/WithoutAuth'
import { UserAuthProvider } from './hooks/UserAuthContext'
import { AdminOrders } from './pages/AdminOrders'
import { AdminProducts } from './pages/AdminProducts'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Orders } from './pages/Orders'
import { Products } from './pages/Products'
import { Register } from './pages/Register'

import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const router = createBrowserRouter([
  {
    element: <NavbarWrapper />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <WithoutAuth>
          <Login />
        </WithoutAuth>
      },
      {
        path: '/register',
        element: <WithoutAuth>
          <Register />
        </WithoutAuth>
      },
      {
        path: '/admin',
        element: <RequireUserWrapper role='ADMIN' />,
        children: [
          {
            path: 'products',
            element: <AdminProducts />
          },
          {
            path: 'orders',
            element: <AdminOrders />
          }
        ]
      },
      {
        path: '/user',
        element: <RequireUserWrapper role='USER' />,
        children: [
          {
            path: 'products',
            element: <Products />
          },
          {
            path: 'orders',
            element: <Orders />
          }
        ]
      }
    ]
  }
])

function App() {
  return <UserAuthProvider>
    <RouterProvider router={router} />
  </UserAuthProvider>
}

export default App
