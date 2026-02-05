import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { StoreConfigProvider } from './context/StoreConfigContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import Skeleton from './components/ui/skeleton';
import './i18n';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const ProductGrid = lazy(() => import('./components/ProductGrid'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Terms = lazy(() => import('./pages/Terms'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Returns = lazy(() => import('./pages/Returns'));
const ConnectionCheck = lazy(() => import('./pages/ConnectionCheck'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages Lazy Load
const AdminLayout = lazy(() => import('./layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProductList = lazy(() => import('./pages/admin/AdminProductList'));
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Attributes = lazy(() => import('./pages/admin/Attributes'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const Coupons = lazy(() => import('./pages/admin/Coupons'));
const Newsletter = lazy(() => import('./pages/admin/Newsletter'));
const Chat = lazy(() => import('./pages/admin/Chat'));
const Tickets = lazy(() => import('./pages/admin/Tickets'));
const CMS = lazy(() => import('./pages/admin/CMS'));
const Blog = lazy(() => import('./pages/admin/Blog'));
const Files = lazy(() => import('./pages/admin/Files'));
const Carriers = lazy(() => import('./pages/admin/Carriers'));
const Tax = lazy(() => import('./pages/admin/Tax'));
const Settings = lazy(() => import('./pages/admin/Settings'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-gray-100 border-t-gold rounded-full animate-spin"></div>
      <p className="text-coffee-dark font-serif tracking-widest text-sm animate-pulse">LOADING YEMENI.MARKET...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: '#2C1E14',
            color: '#D4AF37',
            border: '1px solid #D4AF37',
            fontFamily: "'Outfit', sans-serif"
          },
        }}
      />
      <StoreConfigProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ... existing routes ... */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductGrid />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/connection-check" element={<ConnectionCheck />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />

                  {/* Legal Routes */}
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/returns" element={<Returns />} />

                  {/* Admin Routes - Protected */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProductList />} />
                    <Route path="products/new" element={<ProductEditor />} />
                    <Route path="products/edit/:id" element={<ProductEditor />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="attributes" element={<Attributes />} />
                    <Route path="brands" element={<Brands />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="coupons" element={<Coupons />} />
                    <Route path="newsletter" element={<Newsletter />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="tickets" element={<Tickets />} />
                    <Route path="cms" element={<CMS />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="files" element={<Files />} />
                    <Route path="carriers" element={<Carriers />} />
                    <Route path="tax" element={<Tax />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Catch-all 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>

      </StoreConfigProvider>
      <CookieConsent />
    </Router >
  );
}

export default App;
