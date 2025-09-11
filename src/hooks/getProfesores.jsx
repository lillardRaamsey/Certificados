import { collection, getDocs } from "firebase/firestore";
import { db } from "firestore/firebase";

  const colProfesores = collection(db, "profesores");
  
  const snapProfesores = await getDocs(colProfesores);
  
  const dataProfesores = snapProfesores.docs.map(d => ({id: d.id,...d.data()}));
  console.log(dataProfesores);
