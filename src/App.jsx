import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import CategoriesPage from './pages/CategoriesPage';
import Admin from './pages/Admin';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/produit/:slug" element={<ProductDetail />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
}
