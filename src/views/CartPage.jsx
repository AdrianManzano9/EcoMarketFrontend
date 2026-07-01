import { useState } from "react";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";

function CartPage({ onViewHome }) {
  // Estado global del carrito
  const { cart, addToCart, removeFromCart, clearCart, cartTotal } = useCart();

  // Estados locales para el formulario de finalización de compra
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejador del envío de la orden a Spring Boot
  const handleCheckout = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    if (cart.length === 0) return;

    if (!customerName.trim()) {
      alert("Por favor, ingresa tu nombre para procesar la compra.");
      return;
    }

    setIsSubmitting(true);

    // Estructuramos el objeto exactamente como lo espera el Backend
    const orderData = {
      customerName: customerName.trim(),
      message: message.trim(),
      orderDate: new Date().toISOString(), // Formato ISO compatible con LocalDateTime de Java
      totalPrice: cartTotal,
      // Mapeamos los ítems del carrito de React al formato DTO/Intermedio del back (productId y quantity)
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      // Enviamos la orden mediante el servicio
      const savedOrder = await orderService.createOrder(orderData);

      alert(`¡Compra realizada con éxito! Orden N°: ${savedOrder.id}`);
      clearCart(); // Vaciamos el carrito global
      if (onViewHome) onViewHome(); // Redirigimos al catálogo
    } catch (error) {
      alert(
        "Hubo un error al procesar tu orden. Revisa la consola o el estado del servidor.",
      );
      console.error("Error en checkout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el carrito está vacío, mostramos una vista limpia invitando a comprar
  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🛒</span>
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestro catálogo y suma productos sustentables.</p>
          <button style={styles.backButton} onClick={onViewHome}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tu Carrito de Compras</h2>

      <div style={styles.layout}>
        {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
        <div style={styles.productsColumn}>
          {cart.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <div style={styles.itemInfo}>
                <h4 style={styles.itemName}>{item.name}</h4>
                <p style={styles.itemPrice}>
                  ${item.price.toLocaleString("es-AR")} c/u
                </p>
              </div>

              {/* Controles de cantidad */}
              <div style={styles.quantityControls}>
                <button
                  style={styles.controlBtn}
                  onClick={() => removeFromCart(item.id)}
                >
                  -
                </button>
                <span style={styles.quantity}>{item.quantity}</span>
                <button
                  style={styles.controlBtn}
                  onClick={() => addToCart(item)} // addToCart ya valida el stock internamente
                >
                  +
                </button>
              </div>

              <div style={styles.itemSubtotal}>
                ${(item.price * item.quantity).toLocaleString("es-AR")}
              </div>
            </div>
          ))}
        </div>

        {/* COLUMNA DERECHA: FORMULARIO Y TOTAL */}
        <div style={styles.summaryColumn}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Resumen de Compra</h3>

            <div style={styles.totalRow}>
              <span>Total a pagar:</span>
              <span style={styles.totalAmount}>
                $
                {cartTotal.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <hr style={styles.divider} />

            <form onSubmit={handleCheckout} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Cliente *</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Ej. Juan Pérez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notas o Mensaje Adicional</label>
                <textarea
                  style={{ ...styles.input, ...styles.textarea }}
                  placeholder="Ej. Horario de entrega, indicaciones de la casa..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  rows="3"
                />
              </div>

              <button
                type="submit"
                style={styles.checkoutButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Confirmar Pedido 🌱"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
    minHeight: "calc(100vh - 70px)",
  },
  title: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "24px",
  },
  layout: {
    display: "flex",
    flexDirection: "row",
    gap: "32px",
    flexWrap: "wrap",
  },
  productsColumn: {
    flex: "2 1 600px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  summaryColumn: {
    flex: "1 1 350px",
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  itemInfo: {
    flex: "1 1 200px",
  },
  itemName: {
    margin: "0 0 4px 0",
    fontSize: "1.1rem",
    color: "#333",
  },
  itemPrice: {
    margin: 0,
    color: "#666",
    fontSize: "0.9rem",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#f5f5f5",
    padding: "4px 8px",
    borderRadius: "20px",
  },
  controlBtn: {
    border: "none",
    background: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#1b5e20",
    fontWeight: "bold",
    width: "24px",
  },
  quantity: {
    fontSize: "1rem",
    fontWeight: "600",
    minWidth: "20px",
    textAlign: "center",
  },
  itemSubtotal: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    minWidth: "100px",
  },
  summaryCard: {
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    position: "sticky",
    top: "100px",
  },
  summaryTitle: {
    margin: "0 0 16px 0",
    fontSize: "1.3rem",
    color: "#1b5e20",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
    margin: "20px 0",
  },
  totalAmount: {
    color: "#2e7d32",
    fontSize: "1.4rem",
  },
  divider: {
    border: "0",
    borderTop: "1px solid #e0e0e0",
    margin: "16px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    resize: "none",
    fontFamily: "inherit",
  },
  checkoutButton: {
    backgroundColor: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "8px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    maxWidth: "500px",
    margin: "40px auto",
    border: "1px dashed #ccc",
  },
  emptyIcon: {
    fontSize: "3rem",
    display: "block",
    marginBottom: "16px",
  },
  backButton: {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "16px",
  },
};

export default CartPage;
