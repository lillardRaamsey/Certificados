import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig.jsx';


function FirestoreTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const collectionName = "certificados"; 
  

  const columns = ['archivoURL', 'creado', 'userEmail']; 

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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando datos de Firebase...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>Error: {error}</div>;
  }
  
  
  if (data.length === 0) {
      return <div style={{ padding: '20px', textAlign: 'center' }}>No se encontraron documentos en la colección **'{collectionName}'**.</div>;
  }


  const dynamicColumns = columns.length > 0 ? columns : ['ID', ...Object.keys(data[0]).filter(key => key !== 'id')];


  return (
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Datos de la Colección "{collectionName}" (Firebase Firestore)</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            
            {dynamicColumns.map((col, index) => (
              <th key={index} style={styles.th}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          
          {data.map((item) => (
            <tr>
              <td style={styles.td}>
                {item.archivoURL ? (
                  <a 
                    href={item.archivoURL} 
                    target="_blank" 
                    download 
                    rel="noopener noreferrer"
                    // === ESTILO APLICADO AQUÍ ===
                    style={{ color: 'black', textDecoration: 'none' }} 
                    // textDecoration: 'none' es opcional, elimina el subrayado.
                  >
                    {item.archivoURL} 
                  </a>
                ) : (
                    'N/A'
                )}
              </td>
              <td style={styles.td}>
                  {item.creado && typeof item.creado.toDate === 'function' 
                    ? item.creado.toDate().toLocaleString() 
                    : item.creado || 'N/A'
                  }
              </td>
              <td style={styles.td}>{item.userEmail}</td>

              
            </tr>
          ))}
        </tbody>
      </table>
      <p style={styles.footer}>Total de documentos recuperados: **{data.length}**</p>
    </div>
  );
}


const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    th: {
      border: '1px solid #ddd',
      padding: '12px',
      textAlign: 'left',
      backgroundColor: '#f2f2f2',
      color: '#333',
    },
    td: {
      border: '1px solid #ddd',
      padding: '12px',
      textAlign: 'left',
    },
    footer: {
        marginTop: '15px',
        fontSize: '0.9em',
        color: '#666'
    }
  };

export default FirestoreTable;