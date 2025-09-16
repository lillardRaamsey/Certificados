import { collection, getDocs } from "firebase/firestore";
import { db } from "firestore/firebase";
const colSecretaria = collection(db, "secretaria");
const snapSecretaria = await getDocs(colSecretaria);
const dataSecretaria = snapSecretaria.docs.map(d => ({id: d.id,...d.data()}));
console.log(dataSecretaria);