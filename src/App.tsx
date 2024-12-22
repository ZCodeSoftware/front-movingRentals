import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import { Home, ListByCategory, Cart, Login, Signin, Profile, Dashboard } from './pages';
import {
  HOME_ROUTE,
  LIST_BY_CATEGORY_ROUTE,
  CART_ROUTE,
  LOGIN_ROUTE,
  SIGNIN_ROUTE,
  PROFILE_ROUTE,
  DASHBOARD_ROUTE,
  SUCCESS_PAYMENT_ROUTE
} from './config/routes';
import NotFoundPage from './pages/notFound';
import ProtectedRoute from './utils/protectedRoute';
import SuccessPaymentPage from './pages/successPayment';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={HOME_ROUTE} element={<Home />} />
          <Route path={LIST_BY_CATEGORY_ROUTE} element={<ListByCategory />} />
          <Route path={CART_ROUTE} element={<Cart />} />
          <Route path={LOGIN_ROUTE} element={<Login />} />
          <Route path={SIGNIN_ROUTE} element={<Signin />} />
          <Route path={PROFILE_ROUTE} element={<Profile />} />
          <Route path={SUCCESS_PAYMENT_ROUTE} element={<SuccessPaymentPage />} />
          <Route
            path={DASHBOARD_ROUTE}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;