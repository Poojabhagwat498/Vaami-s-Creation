import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Bag from "./pages/Bag";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import Me from "./pages/Me";
import Category from "./pages/Category";
import Menu from "./pages/Menu";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout"; // <-- Added this import
import WishList from "./pages/WishList";
import AdminUsers from "./pages/AdminUsers";


function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Routes WITHOUT Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes WITH Layout */}
        <Route element={<Layout />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/wishlist" element={<WishList />} />

          <Route path="/menu" element={<Menu />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route
            path="/bag"
            element={
              <ProtectedRoute>
                <Bag />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/admin/users" element={<AdminUsers />} />

          
          <Route path="/me" element={<Me />} />
          <Route path="/category/:categoryName" element={<Category />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
