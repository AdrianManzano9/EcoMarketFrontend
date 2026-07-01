import "react";

function Navbar({ cartCount = 0, currentView, onViewChange }) {
  return (
    <nav style={styles.navbar}>
      {/*Logo / Botón de inicio */}
      <div style={styles.logoContainer} onClick={() => onViewChange("home")}>
        <span style={styles.logoIcon}>🌱</span>
        <h1 style={styles.logoText}>EcoMarket</h1>
      </div>

      {/*Menú de Navegación*/}
      <div style={styles.menu}>
        <button
          className={`nav-btn ${currentView === "home" ? "active" : ""}`}
          onClick={() => onViewChange("home")}
        >
          Inicio
        </button>

        <button
          className={`nav-btn ${currentView === "admin-products" ? "active" : ""}`}
          onClick={() => onViewChange("admin-products")}
        >
          Adm. Productos
        </button>

        <button
          className={`nav-btn ${currentView === "admin-orders" ? "active" : ""}`}
          onClick={() => onViewChange("admin-orders")}
        >
          Adm. Órdenes
        </button>

        {/* Botón del Carrito */}
        <button
          style={{
            ...styles.cartButton,
            ...(currentView === "cart" ? styles.activeCart : {}),
          }}
          onClick={() => onViewChange("cart")}
        >
          <span style={styles.cartIcon}>🛒</span>
          <span style={styles.cartText}>Mi Carrito</span>
          {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    height: "70px",
    backgroundColor: "#2e7d32",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logoContainer: { display: "flex", alignItems: "center", cursor: "pointer" },
  logoIcon: { fontSize: "1.8rem", marginRight: "8px" },
  logoText: {
    fontSize: "1.4rem",
    margin: 0,
    fontWeight: "bold",
    color: "#fff",
  },
  menu: { display: "flex", alignItems: "center", gap: "12px" },
  cartButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1b5e20",
    border: "1px solid #c8e6c9",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s ease",
    marginLeft: "8px",
  },
  activeCart: {
    backgroundColor: "#ffffff",
    color: "#1b5e20",
    border: "1px solid #ffffff",
  },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    minWidth: "18px",
    textAlign: "center",
  },
};
export default Navbar;
