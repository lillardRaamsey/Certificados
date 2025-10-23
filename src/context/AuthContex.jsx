import { createContext, useContext, useEffect, useState} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext()
export function AuthProvider ({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, async (usuarioFirebase) => {
            if(usuarioFirebase){
            setUser(usuarioFirebase);
            const ref = doc(db, "usuarios",usuarioFirebase.uid);
            const snap = await getDoc(ref);
            if (snap.exists()){
                setUserData(snap.data());
            }else{
                setUserData(null);
            }
            }else {
            setUser(null);
            setUserData(null);
            }
            setLoading(false);
        });
        return () => unsub();
    },[]);

    const value = {user, userData ,loading};
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);