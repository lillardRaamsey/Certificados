import {collection, getDocs} from "firebase/firestore";
import { db } from "firestore/firebase";

const colAdmin = collection (db, "Admin");

const snapAdmin = await getDocs (colAdmin);

const dataAdmin = snapAdmin.docs.map(doc => ({id: doc.id, …doc.data( )}));
console.log(dataAdmin);