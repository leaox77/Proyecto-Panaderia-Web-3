import { useState, useEffect } from 'react';
import axios from "axios";

function App() {
  const [categorias, setCategorias] = useState([]);

  useEffect(()=>{
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/categorias"
      );
      //axios.get -> devolver = data, satus:200, headers

      setCategorias(response.data);
    }
    catch (error){
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Panaderia</h1>

      <h2>Categorias</h2>

      {categorias.map((categoria)=>(
        <div key={categoria.id}>
          <h3>{categoria.nombre}</h3>
        </div>
      ))}
    </div>
  )
}

export default App
