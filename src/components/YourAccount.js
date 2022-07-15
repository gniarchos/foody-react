import React from 'react'
import {useLocation} from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import "./YourAccount.css"
import { db } from "../services/firebase"
import { useAuth } from '../contexts/AuthContext'
import { Icon } from '@iconify/react';


export default function YourAccount() {

    const location = useLocation();

    document.title = `Foody | ${location.state.username} `

    const [darkMode, setDarkMode] = React.useState()
    const usernameRef = React.useRef()
    const emailRef = React.useRef()
    const emailConfirmRef = React.useRef()
    const ageRef = React.useRef()
    const addressRef= React.useRef()
    const cityRef= React.useRef()
    const passwordRef = React.useRef()
    const passwordConfirmRef = React.useRef()
    const { currentUser, logout } = useAuth()
    const [city, setCity] = React.useState()
    const [address, setAddress] = React.useState()
    const [userFname, setUserFname] = React.useState()
    const [userLname, setUserLname] = React.useState()
    const [userMemberDate, setUserMemberDate] = React.useState()
    const [userWarning, setUserWarning] = React.useState(false)
    const [userOrders, setUserOrders] = React.useState()
    const [categoriesCount, setCategoriesCount] = React.useState([])
    const [favoriteCateg, setFavoriteCateg] = React.useState("-")
    const [isSaved, setIsSaved] = React.useState(false)

    React.useEffect(() => {

        // const date = new Date();
        // const hour = date.getHours()
        // // const hour = 18
        
        // if (hour <= 5 || hour >= 20) 
        // {
        //     localStorage.setItem('darkMode', 'enabled')
        //     document.body.classList.add('dark')
        //     setDarkMode(true)
        // } 
        // else
        // {
        //     localStorage.setItem('darkMode', null)
        //     document.body.classList.add('light')
        //     setDarkMode(false)
        // }

        db.collection('users').doc(currentUser.uid).get().then(doc => {
            // console.log(doc.data().age)
            // setUserAge(doc.data().age)
            // setUsername(doc.data().username)
            setCity(doc.data().city)
            setAddress(doc.data().address)
            setUserFname(doc.data().fname)
            setUserLname(doc.data().lname)
            setUserMemberDate(`${doc.data().member_since.toDate().toDateString()} - ${doc.data().member_since.toDate().toLocaleTimeString()}`)
            setUserOrders(doc.data().orders)
            setCategoriesCount([doc.data().souvlaki, doc.data().pizza, doc.data().brunch, doc.data().coffee, doc.data().noodles, doc.data().cocktails, doc.data().burger])

        })

        return () => {
            setCity()
            setAddress()
            setUserFname()
            setUserLname()
            setUserMemberDate()
            setUserOrders()
            setCategoriesCount()
        }

        
    
    }, [])

    React.useEffect(() => {

        const index = categoriesCount.indexOf(Math.max(...categoriesCount))
            
        // console.log(`The max value is the ${index+1}nth value in the array`)
        // console.log(Math.max(...categoriesCount))

        if (index === 0) 
        {
            setFavoriteCateg("Souvlaki")
        }
        else if (index === 1)
        {
            setFavoriteCateg("Pizza")
        }
        else if (index === 2)
        {
            setFavoriteCateg("Brunch")
        }
        else if (index === 3)
        {
            setFavoriteCateg("Coffee")
        }
        else if (index === 4)
        {
            setFavoriteCateg("Noodles")
        }
        else if (index === 5)
        {
            setFavoriteCateg("Cocktails")
        }
        else if (index === 6)
        {
            setFavoriteCateg("Burger")
        }

    }, [categoriesCount])


    // var vid = document.getElementById("top-video")
    // vid.playbackRate = 0.5
    function handleInfo(event) {
        const {value, name} = event.target
        setUserWarning(true)
        // console.log(value, name)
        if (name === "city")
        {
            setCity(value)
        }
        else if (name === "address")
        {
            setAddress(value)
        }
        else if (name === "fname")
        {
            setUserFname(value)
        }
        else if (name === "lname")
        {
            setUserLname(value)
        }
    }

    function saveChanges(e)
    {
        e.preventDefault()
        db.collection("users").doc(currentUser.uid).update({lname: userLname, fname: userFname, city: city, address: address})

        // TODO: SUCCESS MESSAGE
        setIsSaved(true)

    }

  return (
    <div className='account-layout'>
        <Navbar 
            isLoggedIn={true} 
            username={location.state.username}
            isHome={false}
            userId={location.state.userId}
            isYourAccount={true}
        />

        <div>

            <div className='yourAccount-top'>
                <div className='wrapper'>
                    <div className='greeting-account'>Hello, {userFname}! </div>
                    <div className='greeting-account-sub'>Your account</div>
                </div>
            </div>

            <div className='container'>
                <div className='account-details'>
                    
                    <h1>Account Details</h1>
                    <form className="profile-inputs-container" onSubmit={saveChanges}>
                    
                        <div className='profile-groups'>
                            <div className='wrapper-input-label'>
                                <label className='label-profile'>Email</label>
                                <input className="input-profile input-profile-disabled" type="email" name="email" value={currentUser.email} readOnly/>
                            </div>

                            <div className='wrapper-input-label'>
                                <label className='label-profile'>Username</label>
                                <input className="input-profile input-profile-disabled" type="text" name="username" value={location.state.username} readOnly/>
                            </div>
                        </div>

                        <div className='profile-groups'>
                            <div className='wrapper-input-label'>
                                <label className='label-profile'>First Name</label>
                                <input className="input-profile" type="text" name="fname" defaultValue={userFname} onChange={(e) => handleInfo(e)} placeholder="First Name*" required/>
                            </div>

                            <div className='wrapper-input-label'>
                                <label className='label-profile'>Last Name</label>
                                <input className="input-profile" type="text" name="lname" defaultValue={userLname} onChange={(e) => handleInfo(e)} placeholder="Last Name*" required/>
                            </div>
                        </div>

                        <div className='profile-groups'>
                            <div className='wrapper-input-label'>
                                <label className='label-profile'>City</label>
                                <input className="input-profile" type="text" name="city" defaultValue={city} onChange={(e) => handleInfo(e)} placeholder="City*" required/>
                            </div>

                            <div className='wrapper-input-label'>
                                <label className='label-profile'>Address</label>
                                <input className="input-profile" type="text" name="address" defaultValue={address} onChange={(e) => handleInfo(e)} placeholder="Address*" required/>
                            </div>
                            
                        </div>
                        

                        <button type="submit" className={`btn-saveChanges ${isSaved}`}>Save Changes</button>
                        <p className={`success-saved ${isSaved}`} ><Icon icon="akar-icons:circle-check-fill" color="white" width="20" />Changes were successfully saved!</p>
                    </form>
                </div>

                <div className='account-statistics'>
                    <div className='boxes-wrapper'>

                            <div className='box-info'>
                                <h3 className='info-h3'>Orders Count</h3>
                                <h4 className='info-h4'>{userOrders ? userOrders : "0"}</h4>
                            </div>

                            <div className='box-info'>
                                <h3 className='info-h3'>Favorite Category</h3>
                                <h4 className='info-h4'>{favoriteCateg}</h4>
                            </div>

                            <div className='box-info'>
                                <h3 className='info-h3'>Member Since</h3>
                                <h4 className='info-h4'>{userMemberDate ? userMemberDate : "-"}</h4>
                            </div>

                        </div>

                </div>

            </div>

      </div>
      
      <Footer isLogin={false}/>
    </div>
  )
}
