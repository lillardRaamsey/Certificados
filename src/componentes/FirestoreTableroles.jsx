import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../Firebase/firebaseConfig.jsx';
import "../css/firestoreTable.css"


function FirestoreTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const collectionName = "usuarios";
    const columns = ['E-Mail', 'Cargo', 'Nombre', 'Acciones'];


    const handleCargoChange = async (userId, newCargo) => {
        try {
            setLoading(true);
            
           
            const userRef = doc(db, collectionName, userId);


            await updateDoc(userRef, {
                cargo: newCargo
            });


            setData(prevData =>
                prevData.map(item =>
                    item.id === userId ? { ...item, cargo: newCargo } : item
                )
            );
            
            setLoading(false);
            console.log(`Cargo del usuario ${userId} actualizado a: ${newCargo}`);

        } catch (err) {
            console.error("Error al actualizar el cargo en Firestore:", err);

            setError("Error al actualizar. ¿Tus reglas de seguridad (allow update) lo permiten?"); 
            setLoading(false);

        }
    };


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



    const cargoOptions = ['estudiante', 'maestro', 'preceptor', 'secretaria', 'admin'];

    return (
        <div className='container-content'>
            <div className="container-header">
                <h2>
                    Usuarios registrados
                </h2>
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
                            <tr key={item.id}>
                                <td>
                                    {item.email}
                                </td>

                                <td>
                                    <select
                                        value={item.cargo || ''} 
                                        onChange={(e) => handleCargoChange(item.id, e.target.value)}
                                        disabled={loading} 
                                        style={{ padding: '5px', minWidth: '120px' }}
                                    >
                                        <option value="" disabled>Seleccionar cargo</option>
                                        {cargoOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td>
                                    {item.nombre}
                                </td>
                                
                                <td>
                                    <span>Listo</span>
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