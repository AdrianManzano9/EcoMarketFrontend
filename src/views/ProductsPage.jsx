import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";

function ProductsPage() {
  const { addToCart } = useCart();

  // Hook automático para cargar la página
  const {
    data: products,
    loading,
    error,
  } = useFetch(productService.getAllProducts);

  // 2. Estado local solo para capturar el string de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  //FILTRADO EN MEMORIA:
  const filteredProducts =
    products?.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const descMatch = product.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return nameMatch || descMatch; // Busca coincidencia tanto en nombre como en descripción
    }) || [];

  if (loading)
    return (
      <div style={styles.center}>
        <h3>Cargando catálogo de productos...</h3>
      </div>
    );
  if (error)
    return (
      <div style={styles.center}>
        <h3 style={{ color: "#d32f2f" }}>Error: {error}</h3>
      </div>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Nuestro Catálogo Sustentable</h2>

      {/* BARRA DE BÚSQUEDA REACTIVA */}
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Filtra en tiempo real al escribir
          style={styles.searchInput}
        />
      </div>

      {/* RENDERIZADO CONDICIONAL SI NO HAY COINCIDENCIAS */}
      {filteredProducts.length === 0 && (
        <div style={styles.center}>
          <h3>No se encontraron productos que coincidan con "{searchTerm}".</h3>
        </div>
      )}

      {/* GRILLA DE PRODUCTOS (Usa el array filtrado) */}
      <div style={styles.grid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{product.name}</h3>
            <p style={styles.cardDesc}>{product.description}</p>
            <div style={styles.cardFooter}>
              <span style={styles.price}>
                ${product.price.toLocaleString("es-AR")}
              </span>
              <button
                style={styles.addBtn}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Agregar 🛒" : "Sin Stock 🚫"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" },
  title: { fontSize: "1.8rem", color: "#333", marginBottom: "24px" },
  searchBarContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "32px",
    maxWidth: "500px",
    position: "relative",
  },
  searchInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
  },
  cardTitle: { margin: "0 0 10px 0", fontSize: "1.2rem", color: "#333" },
  cardDesc: {
    color: "#666",
    fontSize: "0.9rem",
    margin: "0 0 20px 0",
    flexGrow: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: "1.2rem", fontWeight: "bold", color: "#2e7d32" },
  addBtn: {
    backgroundColor: "#1b5e20",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  center: { textAlign: "center", padding: "40px 0", color: "#555" },
};

export default ProductsPage;
