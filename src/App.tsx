import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./layout"
import { Home } from './pages';
import { HOME_ROUTE } from './config/routes';
import Hero from "./components/hero"

function App() {

  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path={HOME_ROUTE} element={<Home />} />
      </Routes>
    </Layout>
  </Router>
  )
}

export default App
