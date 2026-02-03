import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductGrid from './components/ProductGrid'; // Use ProductGrid as Shop Page
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLayout from './layout/AdminLayout';
import ProductEditor from './pages/admin/ProductEditor';

// ... imports

/* Inside Routes */
<Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route index element={<AdminDashboard />} />
  <Route path="products" element={<ProductEditor />} /> {/* For now using Editor as main list/add for simplicity */}
  <Route path="orders" element={<AdminOrders />} />
</Route>
import AdminOrders from './pages/admin/Orders';
import './i18n';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductGrid />} /> {/* Corrected Route */}
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<div className="p-8">Products Management (Coming Soon)</div>} />
              <Route path="customers" element={<div className="p-8">Customer Management (Coming Soon)</div>} />
              <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
