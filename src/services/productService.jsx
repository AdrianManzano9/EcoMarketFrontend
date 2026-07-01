//  CORRECTO (Usa comillas invertidas)

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

export const productService = {
    
    //OBTENER TODOS LOS PRODUCTOS (O FILTRADOS)
    getAllProducts: async (queryParams = "") => {

        console.log("url de la API de productos:", `${API_URL}${queryParams}`);

        try {
            const response = await fetch(`${API_URL}${queryParams}`);
            if (!response.ok) throw new Error("Error al obtener los productos");
            return await response.json();
        } catch (error) {
            console.error("Error en getAllProducts:", error);
            throw error;
        }
    },

    //OBTENER UN PRODUCTO POR ID
    getProductById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error(`Producto con ID ${id} no encontrado`);
            return await response.json();
        } catch (error) {
            console.error(`Error en getProductById (${id}):`, error);
            throw error;
        }
    },

    //CREAR UN NUEVO PRODUCTO (POST)
    createProduct: async (productData) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData), // Convierte el objeto JS a JSON String
            });
            if (!response.ok) throw new Error("Error al crear el producto");
            return await response.json();
        } catch (error) {
            console.error("Error en createProduct:", error);
            throw error;
        }
    },

    // ACTUALIZAR UN PRODUCTO (PUT)
    updateProduct: async (id, productData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });
            if (!response.ok) throw new Error("Error al actualizar el producto");
            return await response.json();
        } catch (error) {
            console.error(`Error en updateProduct (${id}):`, error);
            throw error;
        }
    },

    // ELIMINAR UN PRODUCTO (DELETE)
    deleteProduct: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            // Como el controlador devuelve 204 No Content, no intentamos hacer response.json()
            if (!response.ok) throw new Error("Error al eliminar el producto");
            return true; 
        } catch (error) {
            console.error(`Error en deleteProduct (${id}):`, error);
            throw error;
        }
    }
};