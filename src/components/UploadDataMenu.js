import React from 'react'
// import { useAuth } from '../contexts/AuthContext'
// import { useNavigate  } from "react-router-dom"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../services/firebase"

export default function UploadDataMenu() {
    document.title = "MENU ITEMS | Upload Data Firebase "

    const [item, setItem] = React.useState("")
    const [desc, setDesc] = React.useState("")
    const [category, setCategory] = React.useState("")
    const [size, setSize] = React.useState(false)
    const [price, setPrice] = React.useState(0)
    const [adultsOnly, setAdultsOnly] = React.useState(false)

    function handleItem(event) {
        const {value} = event.target
        setItem(value)
    }

    function handleDesc(event) {
        const {value} = event.target
        setDesc(value)
    }

    function handleCategory(event) {
        const {value} = event.target
        setCategory(value)
    }

    function handlePrice(event) {
        const {value} = event.target
        setPrice(value)
    }

    function handleAdults(event) {
        const {value} = event.target
        if (value === "1") {
            setAdultsOnly(true)
        }
        
    }

    // function handleSize(event) {
    //     const {value} = event.target
    //     if (value === "1") {
    //         setSize(true)
    //     }
        
        
    // }

    async function addDocument() {
        const docRef = await addDoc(collection(db, "noodles"), {
            item: JSON.parse(JSON.stringify(item)),
            category: JSON.parse(JSON.stringify(category)),
            desc: JSON.parse(JSON.stringify(desc)),
            price: JSON.parse(price),
            adults_only: JSON.parse(adultsOnly),
            // sizeSupport: JSON.parse(size)
          })
    }


  return (
    <div>

        {/* <input type="text" onChange={(e) => handleUsername(e)} placeholder='Username'/>
        <button onClick={setProfileName}>Update Profile</button> */}

        <h1>IMPORT ** MENU ** DATA TO FIREBASE DATABASE</h1>

        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleItem(e)} placeholder='Item'/>
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleDesc(e)} placeholder='Description'/>
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleCategory(e)} placeholder='Category'/>
        <input type="number" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handlePrice(e)} placeholder='Price'/>
        {/* <input type="number" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleSize(e)} placeholder='Size Support'/> */}
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleAdults(e)} placeholder='Adults Only'/>

        {/* 
        
        <input type="number" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleReviews(e)} placeholder='Store Reviews'/>
        
        <input type="number" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleMinOrder(e)} placeholder='Store Minimum Order'/>
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleImage(e)} placeholder='Store Image'/> */}


        <button onClick={addDocument}>Add document</button>
    </div>
  )
}
