import { collection, getDocs } from "firebase/firestore";
import { db } from "firestore/firebase"; // tu archivo de configuración
// referencia a la colección
  const colPreceptores = collection(db, "preceptores");
// obtenemos snapshot de documentos
  const snapPreceptores = await getDocs(colPreceptores);
// mapeamos id + data
  const dataPreceptores = snapPreceptores.docs.map(d => ({id: d.id,...d.data()}));
  console.log(dataPreceptores);
