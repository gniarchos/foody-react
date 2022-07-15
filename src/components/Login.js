import React, { useRef } from "react";
import login_img from '../images/side-img.jpg'
import login_img_dark from '../images/side-img-dark-2.jpg'
import error_img from '../images/error.png'
import { useAuth } from "../contexts/AuthContext";
import Navbar from './Navbar'
import Footer from './Footer'
import { Link, useNavigate  } from "react-router-dom"

import './login.css'

export default function Login(props) {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser } = useAuth()
    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [darkMode, setDarkMode] = React.useState(false)
    const navigate = useNavigate ()

    document.title = "Foody | Login "

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true) //cant click sign up button multiple times
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        }
        catch {
            setError('Incorrect email or password')
        }

        setLoading(false)
        
    }

    // React.useEffect(() => {

    //     const date = new Date();
    //     const hour = date.getHours()
    //     // const hour = 18
        
    //     if (hour <= 5 || hour >= 20) 
    //     {
    //         localStorage.setItem('darkMode', 'enabled')
    //         document.body.classList.add('dark')
    //         setDarkMode(true)
    //     } 
    //     else
    //     {
    //         localStorage.setItem('darkMode', null)
    //         document.body.classList.add('light')
    //         setDarkMode(false)
    //     }


    // }, [])



    return (
        <>
            <Navbar />
            <div className="container-login">
                <div className="login-div">

                    <label className="label-signin"> Log In </label>
                    {error && <p className="error-messages"><img style={{paddingRight: "10px"}}src={error_img} alt="error-img" /> {error}</p>}
                    {/* {currentUser.email} */}
                    <form onSubmit={handleSubmit} className="form-login">
            
                        <input className="input-login" type="email" name="email" placeholder="Email" ref={emailRef} required/>
                    
                        <input className="input-login" type="password" name="password" placeholder="Password" ref={passwordRef} required/>
                        
                        <button disabled={loading} type="submit" className="btn-login" >Log In</button>
                        
                        <div className="forgotPassword-link">
                            <Link to="/forgot-password" className="link-forgotpass">Forgot your Password?</Link>
                        </div>

                        <div className="signup-link">
                            Not a member? <Link to="/signup" >Sign up here</Link>
                        </div>
            
                    </form>
                </div>

                <div className="side-img-div">
                    <img className="login-side-img" src={darkMode ? login_img_dark : login_img} alt="login_img"/>
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