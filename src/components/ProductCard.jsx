import 'react';

// Recibimos el objeto 'product' y la función 'onAddToCart' como props desde el componente padre
function ProductCard({ product, onAddToCart }) {
  
  // eslint-disable-next-line no-unused-vars
  const { id, name, description, price, stock } = product;

  // Manejador del clic del botón
  const handleAddClick = () => {
    if (stock > 0 && onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card" style={styles.card}>
      <div style={styles.body}>
        <h3 style={styles.title}>{name}</h3>
        <p style={styles.description}>{description}</p>
        
        <div style={styles.infoContainer}>
          <span style={styles.price}>
            ${price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </span>
          <span style={stock > 0 ? styles.stockIn : styles.stockOut}>
            {stock > 0 ? `Stock: ${stock} u.` : 'Sin Stock'}
          </span>
        </div>
      </div>

      <button 
        onClick={handleAddClick} 
        disabled={stock === 0}
        style={{
          ...styles.button,
          ...(stock === 0 ? styles.buttonDisabled : styles.buttonEnabled)
        }}
      >
        {stock > 0 ? 'Agregar al carrito' : 'Agotado'}
      </button>
    </div>
  );
}


const styles = {
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'between',
    height: '100%',
    transition: 'transform 0.2s',
  },
  body: {
    flexGrow: 1,
    marginBottom: '16px'
  },
  title: {
    fontSize: '1.2rem',
    margin: '0 0 8px 0',
    color: '#333',
    fontWeight: '600'
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 16px 0',
    lineHeight: '1.4'
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  },
  price: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#2e7d32'
  },
  stockIn: {
    fontSize: '0.85rem',
    color: '#555',
    backgroundColor: '#e8f5e9',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  stockOut: {
    fontSize: '0.85rem',
    color: '#c62828',
    backgroundColor: '#ffebee',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: 'bold'
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonEnabled: {
    backgroundColor: '#1976d2',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
    cursor: 'not-allowed'
  }
};

export default ProductCard;