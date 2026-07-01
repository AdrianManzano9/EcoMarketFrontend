import { useState, useEffect } from 'react';

// Recibe como parámetro una función del servicio (ej: productService.getAllProducts)
export function useFetch(serviceFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    serviceFunction()
      .then((result) => {
        if (isMounted) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Error al cargar los datos");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false; // Evita fugas de memoria si el componente se desmonta antes
    };
  }, dependencies); // Se vuelve a ejecutar si cambian las dependencias

  return { data, loading, error, setData };
}