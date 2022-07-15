import React, { useContext, useEffect } from "react";
import { auth, db} from "../services/firebase"
import { serverTimestamp } from "firebase/firestore"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = React.useState()
    const [loading, setLoading] = React.useState(true)

    function signup(email, password, age, username, address, city, fname, lname) {
        // return auth.createUserWithEmailAndPassword(email, password)
        return auth.createUserWithEmailAndPassword(email, password).then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
                username: username,
                age: age,
                city: city,
                address: address,
                fname: fname,
                lname: lname,
                souvlaki: 0,
                pizza: 0,
                brunch: 0,
                coffee: 0,
                burger: 0,
                noodles: 0,
                cocktails: 0,
                member_since: serverTimestamp()

            })
        })
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email,password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])
    

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>   
    )
}
    