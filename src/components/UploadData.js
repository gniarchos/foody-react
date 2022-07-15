import React from 'react'
// import { useAuth } from '../contexts/AuthContext'
// import { useNavigate  } from "react-router-dom"
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../services/firebase"

export default function UploadData() {

    // const [username, setUsername] = React.useState("")
    // const { currentUser, logout } = useAuth()

    document.title = "STORES | Upload Data Firebase "


    const [name, setName] = React.useState("")
    const [location, setLocation] = React.useState("")
    const [category, setCategory] = React.useState("")
    const [reviews, setReviews] = React.useState(0)
    const [image, setImage] = React.useState("")
    const [minOrder, setMinOrder] = React.useState(0)
    const [stars, setStars] = React.useState(0)

    // const navigate = useNavigate ()

    // function handleUsername(event) {
    //     const {value} = event.target
    //     setUsername(value)
    // }

    // async function setProfileName() {
    //     try {
    //         await currentUser.updateProfile({
    //             displayName: JSON.parse(JSON.stringify(username))
    //         })
    //         navigate("/")
    //     }
    //     catch {
    //         console.log("Something went wrong")
    //     }   
    // }

    function handleName(event) {
        const {value} = event.target
        setName(value)
    }

    function handleLocation(event) {
        const {value} = event.target
        setLocation(value)
    }

    function handleCategory(event) {
        const {value} = event.target
        setCategory(value)
    }

    function handleReviews(event) {
        const {value} = event.target
        setReviews(value)
    }

    function handleImage(event) {
        const {value} = event.target
        setImage(value)
    }

    function handleMinOrder(event) {
        const {value} = event.target
        setMinOrder(value)
    }

    function handleStars(event) {
        const {value} = event.target
        setStars(value)
    }

    async function addDocument() {
        const docRef = await addDoc(collection(db, "stores"), {
            name: JSON.parse(JSON.stringify(name)),
            category: JSON.parse(JSON.stringify(category)),
            location: JSON.parse(JSON.stringify(location)),
            reviews: JSON.parse(reviews),
            image: JSON.parse(JSON.stringify(image)),
            min_order: JSON.parse(minOrder),
            stars: JSON.parse(stars)
          });
    }


  return (
    <div>

        {/* <input type="text" onChange={(e) => handleUsername(e)} placeholder='Username'/>
        <button onClick={setProfileName}>Update Profile</button> */}

        <h1>IMPORT ** STORES ** DATA TO FIREBASE DATABASE</h1>

        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleName(e)} placeholder='Store Name'/>
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleLocation(e)} placeholder='Store Location'/>
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleCategory(e)} placeholder='Store Category'/>
        <input type="number" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleReviews(e)} placeholder='Store Reviews'/>
        <input type="number" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleStars(e)} placeholder='Store Stars'/>
        <input type="number" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleMinOrder(e)} placeholder='Store Minimum Order'/>
        <input type="text" style={{width: "500px", height: "50px", fontSize: "1.1rem"}} onChange={(e) => handleImage(e)} placeholder='Store Image'/>


        <button onClick={addDocument}>Add document</button>
    </div>
  )
}
