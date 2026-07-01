import { useState } from "react";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProductsPage from "./views/ProductsPage";
import CartPage from "./views/CartPage";
import { AdminProducts } from "./views/AdminProducts";
import { AdminOrders } from "./views/AdminOrders";
import "./App.css"; // Importamos el CSS global

function AppContent() {
  const { cartCount } = useCart();

  // Estado de enrutamiento manual: 'home', 'cart', 'admin-products', 'admin-orders'
  const [view, setView] = useState("home");

  return (
    <div>
      {/* Le pasamos la vista actual y la función unificada para cambiarla */}
      <Navbar
        cartCount={cartCount}
        currentView={view}
        onViewChange={(targetView) => setView(targetView)}
      />

      <main>
        {/* Renderizado condicional basado en la vista seleccionada */}
        {view === "home" && <ProductsPage />}

        {view === "cart" && <CartPage onViewHome={() => setView("home")} />}

        {view === "admin-products" && <AdminProducts />}

        {view === "admin-orders" && <AdminOrders />}
      </main>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
