import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

//TODO: USE VARIABLES FOR KEYS
const app = firebase.initializeApp({
  apiKey: "****",
  authDomain: "****",
  projectId: "****",
  storageBucket: "****",
  messagingSenderId: "****",
  appId: "****",
})

// const app = firebase.initializeApp(firebaseConfig)

// export const auth = firebase.auth()
export const db = firebase.firestore()
export const auth = app.auth()

export default app
