import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./layout"
import { Home, ListByCategory } from './pages';
import { HOME_ROUTE, LIST_BY_CATEGORY_ROUTE } from './config/routes';
import Hero from "./components/hero"

function App() {

  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path={HOME_ROUTE} element={<Home />} />
        <Route path={LIST_BY_CATEGORY_ROUTE} element={<ListByCategory />} />
      </Routes>
    </Layout>
  </Router>
  )
}

export default App
