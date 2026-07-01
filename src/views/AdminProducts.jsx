import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { productService } from "../services/productService";

export function AdminProducts() {
  // Cargamos los productos y extraemos setData para actualizar la lista visual dinámicamente sin recargar la página
  const {
    data: products,
    loading,
    error,
    setData: setProducts,
  } = useFetch(productService.getAllProducts);

  // Estados del formulario
  const [id, setId] = useState(null); // Si tiene ID, estamos EDITANDO; si es null, estamos CREANDO
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  if (loading)
    return (
      <div style={styles.center}>
        <h3>Cargando historial de órdenes...</h3>
      </div>
    );
  if (error)
    return (
      <div style={styles.center}>
        <h3 style={{ color: "#d32f2f" }}>Error: {error}</h3>
      </div>
    );

  const resetForm = () => {
    setId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
  };

  // Guardar (POST o PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
    };

    try {
      if (id) {
        // PUT
        const updated = await productService.updateProduct(id, productData);
        setProducts(products.map((p) => (p.id === id ? updated : p)));
        alert("Producto actualizado con éxito.");
      } else {
        // POST
        const created = await productService.createProduct(productData);
        setProducts([...products, created]);
        alert("Producto creado con éxito.");
      }
      resetForm();
    } catch (error) {
      alert("Error al procesar la operación. " + error);
    }
  };

  // Funcion en el formulario para editar
  const handleEditClick = (product) => {
    setId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
  };

  // Eliminar (DELETE)
  const handleDeleteClick = async (productId) => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar este producto de forma permanente?",
      )
    ) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products.filter((p) => p.id !== productId)); // Filtramos visualmente
        alert("Producto eliminado.");
      } catch (error) {
        alert("No se pudo eliminar el producto. " + error);
      }
    }
  };

  if (loading)
    return (
      <div style={styles.center}>
        <h3>Cargando inventario...</h3>
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
      <h2 style={styles.title}>
        Panel de Administración: Inventario de Productos
      </h2>

      {/* FORMULARIO DE ALTA / MODIFICACIÓN */}
      <div style={styles.formCard}>
        <h3>{id ? "📝 Editar Producto" : "✨ Nuevo Producto"}</h3>
        <form onSubmit={handleSubmit} style={styles.formInline}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.inputShort}
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={styles.inputShort}
            required
          />

          <button type="submit" style={styles.saveBtn}>
            {id ? "Actualizar" : "Guardar"}
          </button>
          {id && (
            <button type="button" onClick={resetForm} style={styles.cancelBtn}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Descripción</th>
            <th style={styles.th}>Precio</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p.id} style={styles.tr}>
              <td style={styles.td}>#{p.id}</td>
              <td style={styles.td}>
                <strong>{p.name}</strong>
              </td>
              <td style={styles.td}>{p.description}</td>
              <td style={styles.td}>${p.price.toLocaleString("es-AR")}</td>
              <td style={styles.td}>{p.stock} u.</td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEditClick(p)}
                  style={styles.editBtn}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(p.id)}
                  style={styles.deleteBtn}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
    minHeight: "80vh",
  },
  title: { fontSize: "1.8rem", color: "#333", marginBottom: "24px" },
  layout: { display: "flex", gap: "32px", flexWrap: "wrap" },
  tableColumn: { flex: "2 1 600px" },
  detailColumn: { flex: "1 1 350px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  thRow: { backgroundColor: "#f5f5f5", textAlign: "left" },
  th: {
    padding: "14px",
    borderBottom: "2px solid #e0e0e0",
    color: "#555",
    fontSize: "0.95rem",
  },
  tr: { borderBottom: "1px solid #eee", transition: "background-color 0.2s" },
  td: { padding: "14px", fontSize: "0.95rem", color: "#333" },
  viewBtn: {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editBtn: {
    backgroundColor: "#ffa000",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "8px",
  },
  deleteBtn: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  detailCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
  },
  detailTitle: {
    margin: "0 0 16px 0",
    color: "#1b5e20",
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
  },
  itemList: { listStyle: "none", padding: 0, margin: 0 },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px dashed #eee",
    fontSize: "0.9rem",
  },
  totalDetail: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginTop: "16px",
    color: "#2e7d32",
  },
  noSelection: {
    textAlign: "center",
    padding: "40px",
    color: "#888",
    border: "1px dashed #ccc",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    marginBottom: "24px",
  },
  formInline: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    flex: "1 1 200px",
    fontSize: "0.95rem",
  },
  inputShort: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "90px",
    fontSize: "0.95rem",
  },
  saveBtn: {
    backgroundColor: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#757575",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "40vh",
  },
};
