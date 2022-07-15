import React, { useRef } from "react";
import login_img from '../images/side-img.jpg'
import login_img_dark from '../images/side-img-dark-2.jpg'
import error_img from '../images/error.png'
import success_img from '../images/success.png'
import { useAuth } from "../contexts/AuthContext";
import Navbar from './Navbar'
import Footer from './Footer'
import { Link } from "react-router-dom"
import './forgotPassword.css'

export default function ForgotPassword(props) {

    const emailRef = useRef()
    const { resetPassword, currentUser } = useAuth()
    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [success, setSuccess] = React.useState(false)
    const [darkMode, setDarkMode] = React.useState()

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

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage("")
            setError("")
            setSuccess(false)
            setLoading(true) //cant click sign up button multiple times
            await resetPassword(emailRef.current.value)
            setMessage("Check your email inbox for instructions.")
            setSuccess(true)
        }
        catch {
            setError('Failed to reset password.')
        }

        setLoading(false)
        
    }

    return (
        <>
            <Navbar />
            <div className="container-forgot">
                <div className="forgot-div">

                    <label className="label-signin"> Forgot your Password </label>
                    {error && <p className="error-messages"><img style={{paddingRight: "10px"}}src={error_img} alt="error-img" />{error}</p>}
                    {message && <p className="success-messages"><img style={{paddingRight: "10px"}} src={success_img} alt="success_img" />{message}</p>}
                    {/* {currentUser.email} */}
                    <form onSubmit={handleSubmit} className="form-forgot">
            
                        {!success && <input className="input-forgot" type="email" name="email" placeholder="Enter your email" ref={emailRef} required/>}
                        
                        {!success && <button disabled={loading} type="submit" className="btn-forgot" >Reset</button>}
                        
                        <div className="forgotPassword-link">
                            <Link to="/index" className="link-forgotpass">Back to Login</Link>
                        </div>
            
                    </form>
                </div>

                <div className="side-img-div">
                    <img className="forgot-side-img" src={darkMode ? login_img_dark : login_img} alt="login_img"/>
                </div>
                
            </div>

            <h2 className="featured-title">Featured Stores </h2>
            <div className="featured-div">
                {props.featuredInfo}
            </div>


            <Footer isLogin={true} />
        </>
    )
}