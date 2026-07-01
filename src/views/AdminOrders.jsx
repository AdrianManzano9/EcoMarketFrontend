import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";

export function AdminOrders() {
  // Extraemos setOrders (renombrando el setData del hook) para limpiar la tabla al borrar
  const {
    data: orders,
    loading,
    error,
    setData: setOrders,
  } = useFetch(orderService.getAllOrders);

  // lista completa de productos
  const { data: products } = useFetch(productService.getAllProducts);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Función auxiliar para buscar el producto en el array local por su ID
  const findProductById = (id) => {
    return (
      products?.find((p) => p.id === id) || {
        name: "Producto no encontrado",
        price: 0,
      }
    );
  };

  // Función para el borrado de la orden
  const handleDeleteOrder = async (e, orderId) => {
    e.stopPropagation(); // Evita que al hacer clic en borrar se seleccione la orden en el panel derecho

    if (
      window.confirm(
        `¿Estás seguro de eliminar permanentemente la orden #${orderId}?`,
      )
    ) {
      try {
        await orderService.deleteOrder(orderId);

        // Filtramos el estado para que desaparezca de la tabla sin tener que recargar toda la página
        setOrders(orders.filter((order) => order.id !== orderId));

        // Si la orden eliminada era la que estaba abierta en el detalle, la cerramos
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }

        alert("Orden eliminada correctamente.");
      } catch (err) {
        alert("Error al intentar eliminar la orden. Verifica el backend.");
        console.error(err);
      }
    }
  };

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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Panel de Administración: Órdenes de Compra</h2>

      <div style={styles.layout}>
        {/* TABLA DE ÓRDENES */}
        <div style={styles.tableColumn}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id} style={styles.tr}>
                  <td style={styles.td}>#{order.id}</td>
                  <td style={styles.td}>
                    <strong>{order.customerName}</strong>
                  </td>
                  <td style={styles.td}>
                    {new Date(order.orderDate).toLocaleDateString("es-AR")}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      color: "#2e7d32",
                      fontWeight: "bold",
                    }}
                  >
                    ${order.totalPrice.toLocaleString("es-AR")}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={styles.viewBtn}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Ver 👁️
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={(e) => handleDeleteOrder(e, order.id)}
                      >
                        Eliminar 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DETALLE DE LA ÓRDEN SELECCIONADA */}
        <div style={styles.detailColumn}>
          {selectedOrder ? (
            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>
                Detalle de Orden #{selectedOrder.id}
              </h3>
              <p>
                <strong>Cliente:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Notas:</strong>{" "}
                {selectedOrder.message || "Sin observaciones"}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(selectedOrder.orderDate).toLocaleString("es-AR")}
              </p>

              <h4 style={{ margin: "16px 0 8px 0" }}>Artículos pedidos:</h4>
              <ul style={styles.itemList}>
                {selectedOrder.items?.map((item, index) => {
                  const targetProduct = findProductById(item.productId);
                  const itemSubtotal = targetProduct.price * item.quantity;

                  return (
                    <li key={index} style={styles.itemRow}>
                      <span>
                        <strong>{targetProduct.name}</strong> (x{item.quantity})
                        <br />
                        <small style={{ color: "#777" }}>
                          ID: {item.productId}
                        </small>
                      </span>
                      <span>${itemSubtotal.toLocaleString("es-AR")}</span>
                    </li>
                  );
                })}
              </ul>
              <div style={styles.totalDetail}>
                <span>Total Auditado:</span>
                <span>${selectedOrder.totalPrice.toLocaleString("es-AR")}</span>
              </div>
            </div>
          ) : (
            <div style={styles.noSelection}>
              <p>Selecciona una orden de la lista para auditar sus detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Estilos (Asegúrate de agregar 'deleteBtn' si no lo tenías en tu objeto de estilos de este archivo)
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
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "14px", fontSize: "0.95rem", color: "#333" },
  viewBtn: {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  }, // <-- Estilo del botón rojo
  detailCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
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
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "40vh",
  },
};

export default AdminOrders;
