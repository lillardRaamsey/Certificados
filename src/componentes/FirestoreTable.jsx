import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; 
import { db } from '../Firebase/firebaseConfig.jsx';
import "../css/firestoreTable.css"


function FirestoreTable() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});


  const collectionName = "certificados";
  const columns = ['Certificado', 'Creacion', 'E-Mail del usuario', 'Acciones'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataCollection = collection(db, collectionName);
        const querySnapshot = await getDocsn(dataCollection);
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


  /**
   * @param {string} id
   */
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el documento con ID: ${id}? Esta acción es irreversible.`)) {
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        setData(data.filter(item => item.id !== id));
        alert("Documento eliminado con éxito.");
      } catch (err) {
        console.error("Error al eliminar el documento:", err);
        alert("¡Error! No se pudo eliminar el documento. Revisa la consola.");
      }
    }
  };

  /**
   * @param {object} item
   */
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({
      archivoURL: item.archivoURL || '',
      creado: item.creado ? (item.creado.toDate ? item.creado.toDate().toLocaleString() : item.creado) : '',
      userEmail: item.userEmail || ''
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  
  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSave = async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      
      const updatedFields = {
          archivoURL: editFormData.archivoURL,
          userEmail: editFormData.userEmail,
      };

      await updateDoc(docRef, updatedFields);
      
      setData(data.map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      ));

      setEditingId(null);
      setEditFormData({});
      alert("Documento actualizado con éxito en Firestore.");
    } catch (err) {
      console.error("Error al actualizar el documento:", err);
      alert("¡Error! No se pudo guardar el documento. Revisa la consola.");
    }
  };

  if (loading) {
    return <div className="cargando">Cargando datos de Firebase...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }


  if (data.length === 0) {
    return <div className="no-colecciones">No se encontraron documentos en la colección **'{collectionName}'**.</div>;
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
              {dynamicColumns.map((col, index) => (
                <th key={index}>
                  {col === 'archivoURL' ? 'Archivo (URL)' : col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>

                <td>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      name="archivoURL"
                      value={editFormData.archivoURL}
                      onChange={handleEditFormChange}
                      placeholder="URL del archivo"
                    />
                  ) : item.archivoURL ? (
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
                  {editingId === item.id ? (
                    <input
                      type="email"
                      name="userEmail"
                      value={editFormData.userEmail}
                      onChange={handleEditFormChange}
                      placeholder="Correo de usuario"
                    />
                  ) : (
                    item.userEmail
                  )}
                </td>

                <td>
                  {editingId === item.id ? (
                    <>
 
                      <button onClick={() => handleSave(item.id)} className="btn-save">
                        Guardar
                      </button>

                      <button onClick={handleCancelClick} className="btn-cancel">
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>

                      <button onClick={() => handleEditClick(item)} className="btn-edit">
                        Editar
                      </button>

                      <button onClick={() => handleDelete(item.id)} className="btn-delete">
                        Eliminar
                      </button>
                    </>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
            <p><strong>Total de usuarios registrados: **{data.length}**</strong></p> 
    </div>
  );
} 

export default FirestoreTable;