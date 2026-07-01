import  { createContext, useState, useContext } from 'react';

//Creamos el contexto nativo de React
const CartContext = createContext();

//Proveedor del estado global que va a envolver a <App />
export function CartProvider({ children }) {
  // El carrito es un array de objetos. Cada objeto tiene los datos del producto + la propiedad 'quantity'
  const [cart, setCart] = useState([]);

  // AGREGAR UN PRODUCTO AL CARRITO
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Buscamos si el artículo ya estaba en el carrito
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Comprobamos si la cantidad actual es menor que el stock disponible antes de sumar uno más
        if (existingItem.quantity >= product.stock) {
          alert(`¡Llegaste al límite de stock disponible para: ${product.name}!`);
          return prevCart;
        }
        // Si hay stock, sumamos uno a la cantidad de ese elemento
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // Si el producto es totalmente nuevo en el carrito, lo agregamos con cantidad 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // RESTAR O ELIMINAR UN PRODUCTO DEL CARRITO
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.id === productId) {
          // Si la cantidad es 1 y vuelven a tocar "restar", directamente lo borramos del carrito
          if (item.quantity === 1) return acc; 
          
          // Si tiene más de 1, le restamos una unidad
          return [...acc, { ...item, quantity: item.quantity - 1 }];
        }
        return [...acc, item];
      }, [])
    );
  };

  // LIMPIAR EL CARRITO COMPLETO
  const clearCart = () => {
    setCart([]);
  };


  // Cantidad total de ítems individuales
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Precio total de la compra multiplicando precio por cantidad de cada ítem
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        cartCount, 
        cartTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

//Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
};