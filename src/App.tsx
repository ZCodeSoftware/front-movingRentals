import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import { Home, ListByCategory, Cart, Login, Signin } from './pages'
import { HOME_ROUTE, LIST_BY_CATEGORY_ROUTE, CART_ROUTE, LOGIN_ROUTE, SIGNIN_ROUTE } from './config/routes'
import Hero from './components/hero'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Hero />} />
          <Route path={HOME_ROUTE} element={<Home />} />
          <Route path={LIST_BY_CATEGORY_ROUTE} element={<ListByCategory />} />
          <Route path={CART_ROUTE} element={<Cart />} />
          <Route path={LOGIN_ROUTE} element={<Login />} />
          <Route path={SIGNIN_ROUTE} element={<Signin />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
