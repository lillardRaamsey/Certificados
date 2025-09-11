import { collection, getDocs } from "firebase/firestore";
import { db } from "firestore/firebase"; // tu archivo de configuración
// referencia a la colección
  const colCertificados = collection(db, "certificados");
// obtenemos snapshot de documentos
  const snapCertificados = await getDocs(colCertificados);
// mapeamos id + data
  const dataCertificados = snapCertificados.docs.map(d => ({id: d.id,...d.data()}));
  console.log(dataCertificados);
