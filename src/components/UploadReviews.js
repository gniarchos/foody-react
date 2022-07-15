import React from 'react'
import { collection, addDoc } from "firebase/firestore"
import { db } from "../services/firebase"

export default function UploadReviews() {
    document.title = "STORE REVIEWS | Upload Data Firebase "

    const [store, setStore] = React.useState("")
    const [comments, setComments] = React.useState("")
    const [stars, setStars] = React.useState(0)

    function handleStore(event) {
        const {value} = event.target
        setStore(value)
    }

    function handleComments(event) {
        const {value} = event.target
        setComments(value)
    }


    function handleStars(event) {
        const {value} = event.target
        setStars(value)
    }


    async function addDocument() {
        const docRef = await addDoc(collection(db, "reviews"), {
            store: JSON.parse(JSON.stringify(store)),
            stars: JSON.parse(stars),
            comment: JSON.parse(JSON.stringify(comments)),
          })
    }


  return (
    <div>

        <h1>IMPORT ** STORE REVIEWS ** DATA TO FIREBASE DATABASE</h1>

        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleStore(e)} placeholder='Store Name'/>
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleStars(e)} placeholder='Stars'/>
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleComments(e)} placeholder='Comments'/>

        <button onClick={addDocument}>Add document</button>
    </div>
  )
}
