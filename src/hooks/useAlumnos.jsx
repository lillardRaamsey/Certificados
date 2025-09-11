import {collection, getDocs} from"firebase/firestore";
import { db } from "firestore/firebase";
const colAlumnos = collection (db, "alumnos");
const snapAlumnos = await getDocs(colAlumnos);
const dataAlumnos = snapAlumnos.docs.map (d => ({id: d.id, ...d.data() }));
console.log(dataAlumnos);