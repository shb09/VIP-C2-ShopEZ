import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';
import Loading from './components/ui/Loading';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const ManageOrders = lazy(() => import('./pages/admin/ManageOrders'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <NotificationProvider>
                  <ToastProvider>
                    <Suspense fallback={<Loading />}>
                      <Routes>
                        <Route element={<Layout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/orders/:id" element={<OrderDetail />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="products" element={<ManageProducts />} />
                            <Route path="products/new" element={<ProductForm />} />
                            <Route path="products/:id/edit" element={<ProductForm />} />
                            <Route path="orders" element={<ManageOrders />} />
                            <Route path="users" element={<ManageUsers />} />
                          </Route>
                        </Route>
                      </Routes>
                    </Suspense>
                  </ToastProvider>
                </NotificationProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
