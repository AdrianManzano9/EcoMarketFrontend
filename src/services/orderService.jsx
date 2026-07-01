// Detectamos automáticamente si usás Vite o CRA para leer el .env
const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

export const orderService = {
  //OBTENER TODAS LAS ÓRDENES
  getAllOrders: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener las órdenes");
      return await response.json();
    } catch (error) {
      console.error("Error en getAllOrders:", error);
      throw error;
    }
  },

  //CREAR UNA NUEVA ÓRDEN (POST)
  createOrder: async (orderData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Error al procesar la orden de compra");
      return await response.json(); // Devuelve la orden generada con su ID de MySQL
    } catch (error) {
      console.error("Error en createOrder:", error);
      throw error;
    }
  },

  //OBTENER DETALLE DE UNA ÓRDEN POR ID
  getOrderById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`Orden con ID ${id} no encontrada`);
      return await response.json();
    } catch (error) {
      console.error(`Error en getOrderById (${id}):`, error);
      throw error;
    }
  },
  //ACTUALIZAR UNA ORDEN (PUT)
  updateOrder: async (id, OrderData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(OrderData),
      });
      if (!response.ok) throw new Error("Error al actualizar la Orden");
      return await response.json();
    } catch (error) {
      console.error(`Error en updateOrder (${id}):`, error);
      throw error;
    }
  },

  //ELIMINAR UNA ORDEN (DELETE)
  deleteOrder: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      // Como el controlador devuelve 204 No Content, no intentamos hacer response.json()
      if (!response.ok) throw new Error("Error al eliminar la Orden");
      return true;
    } catch (error) {
      console.error(`Error en deleteOrder (${id}):`, error);
      throw error;
    }
  },
};
