import { createContext, useContext, useEffect, useState} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";

const AuthContext = createContext()
export function AuthProvider ({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (usuarioFirebase) => {
            setUser(usuarioFirebase);
            setLoading(false);
        });
        return () => unsub();
    },[]);

    const value = {user, loading};
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);