import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig.jsx';
import "../css/firestoreTable.css"


function FirestoreTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const collectionName = "certificados";


  const columns = ['Certificado', 'Creacion', 'Usuario'];

  useEffect(() => {
    const fetchData = async () => {
      try {

        const dataCollection = collection(db, collectionName);


        const querySnapshot = await getDocs(dataCollection);


        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,

          ...doc.data(),
        }));

        setData(fetchedData);
        setLoading(false);

      } catch (err) {
        console.error("Error al cargar los datos de Firestore:", err);
        setError("Error al conectar o cargar los datos. Revisa la consola y las reglas de seguridad de Firestore.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div classname="cargando">Cargando datos de Firebase...</div>;
  }

  if (error) {
    return <div classname="error">Error: {error}</div>;
  }


  if (data.length === 0) {
    return <div classname="no-colecciones">No se encontraron documentos en la colección **'{collectionName}'**.</div>;
  }


  const dynamicColumns = columns.length > 0 ? columns : ['ID', ...Object.keys(data[0]).filter(key => key !== 'id')];


  return (
    <div className='container-content'>
    <div className="container-header">
      <h2>Certificados recibidos</h2>
    </div>
    <div className="container-table">
      <table>
        <thead>

          <tr>
            {dynamicColumns.map
            ((col, index) => (
              <th key={index}>
                {col}
              </th>
            ))}
          </tr>

        </thead>
        <tbody>

          {data.map((item) => (
            <tr>
              <td>
                {item.archivoURL ? (
                  <a
                    href={item.archivoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir certificado
                  </a>
                ) : (
                  'N/A'
                )}
              </td>

              <td>
                {item.creado && typeof item.creado.toDate === 'function'
                  ? item.creado.toDate().toLocaleString()
                  : item.creado || 'N/A'
                }
              </td>

              <td>
                {item.userEmail}
              </td>


            </tr>
          ))}
        </tbody>
      </table>
    </div>
      <p><strong>Total de documentos recibidos: **{data.length}**</strong></p> 
    </div>
  );
} 

export default FirestoreTable;