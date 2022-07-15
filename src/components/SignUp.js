import React, { useRef } from "react";
import login_img from '../images/side-img.jpg'
import login_img_dark from '../images/side-img-dark-2.jpg'
import error_img from '../images/error.png'
import { useAuth } from "../contexts/AuthContext";
import Navbar from './Navbar'
import Footer from './Footer'
import { Link, useNavigate } from "react-router-dom"

// import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
// import '@geoapify/geocoder-autocomplete/styles/mystyle.css'


import './signUp.css'

export default function SignUp(props) {

    const usernameRef = useRef()
    const emailRef = useRef()
    const emailConfirmRef = useRef()
    const ageRef = useRef()
    const addressRef= useRef()
    const cityRef= useRef()
    const fnameRef = useRef()
    const lnameRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, currentUser } = useAuth()
    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate ()
    const [darkMode, setDarkMode] = React.useState()

    document.title = "Foody | Sign Up "

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value)
        {
            return setError("Passwords do not match!")
        }

        if (emailRef.current.value !== emailConfirmRef.current.value)
        {
            return setError("Emails do not match!")
        }

        try {
            setError("")
            setLoading(true) //cant click sign up button multiple times
            await signup(emailRef.current.value, passwordRef.current.value, ageRef.current.value, usernameRef.current.value, addressRef.current.value, cityRef.current.value, fnameRef.current.value, lnameRef.current.value)
            navigate("/")
        }
        catch {
            setError('Failed to creat an account')
        }

        setLoading(false)
        
    }

    // const [type, seType]



    return (
        <>
            <Navbar />
            
            <div className="container-signup">
                <div className="signup-div">

                    <label className="label-signup"> Create an account </label>
                    {error && <p className="error-messages"><img style={{paddingRight: "10px"}}src={error_img} alt="error-img" />{error}</p>}
                    {/* {currentUser.email} */}
                    <form onSubmit={handleSubmit} id="signupForm" className="form-signup">

                        <div className="signup-inputs-container">
                            <input className="input-signup" type="text" name="fname" placeholder="First Name*" ref={fnameRef} required/>  
                            <input className="input-signup" type="text" name="lname" placeholder="Last Name*" ref={lnameRef} required/>  
                        </div>
                        <div className="signup-inputs-container">
                            <input className="input-signup" type="text" name="username" placeholder="Username*" ref={usernameRef} required/>
                            <input className="input-signup" type="number" name="age" placeholder="Age*" ref={ageRef} required/>
                        </div>
                        <div className="signup-inputs-container">
                            <input className="input-signup" type="text" name="city" placeholder="City*" ref={cityRef} required/>
                            <input className="input-signup" type="text" name="address" placeholder="Address*" ref={addressRef} required/>
                        </div>

                        <div className="signup-inputs-container">
                            <input className="input-signup" type="email" name="email" placeholder="Email*" ref={emailRef} required/>
                            <input className="input-signup" type="email" name="email" placeholder="Confirm Email*" ref={emailConfirmRef} required/>
                        </div>
                        <div className="signup-inputs-container">
                            <input className="input-signup" type="password" name="password" placeholder="Password* (at least 6 characters)" pattern=".{6,}" title="Password must be at least 6 characters" ref={passwordRef} required/>
                            <input className="input-signup" type="password" name="password-confirm" placeholder="Confirm Password*" pattern=".{6,}" title="Password must be at least 6 characters" ref={passwordConfirmRef} required/>
                        </div>

                        <div className="signup-agree">
                        <input class="terms-input" type="checkbox" id="agree" name="terms" required title="You must agree to terms and conditions to continue."/>
                        <label class="terms-label" for="terms"> I agree that my <b>info</b> and <b>address</b> are valid.</label>
                        </div>

                        <button disabled={loading} type="submit" className="btn-signup" >Sign Up</button>
                        

                        <div className="signin-link">
                            Already a member? <Link to="/index">Log in</Link>
                        </div>
            
                    </form>
                </div>

                <div className="side-img-div">
                    <img className="signup-side-img" src={darkMode ? login_img_dark : login_img} alt="login_img"/>
                </div>
            </div>

            <h2 className="featured-title">Featured Stores </h2>
            <div className="featured-div">
                {props.featuredInfo}
            </div>


            <Footer isLogin={true}/>
        </>
    )
}