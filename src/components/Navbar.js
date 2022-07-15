import React from "react";
import foody_logo from '../images/foody-logo-nav-test.png'
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { Icon } from '@iconify/react';
import './navbar.css'

export default function Navbar(props) {

    const [scrolled, setScrolled] = React.useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
    const navigate = useNavigate ()
    const [error, setError] = React.useState("")
    const { currentUser, logout } = useAuth()
    const [darkMode, setDarkMode] = React.useState(false)

    const [themeMethod, setThemeMethod] = React.useState(localStorage.getItem('themeMethod') ? localStorage.getItem('themeMethod') : "Auto")

    let dropDownRef = React.useRef()

    React.useEffect(() => {

        document.addEventListener("mousedown", (event) => {
            // if (dropDownRef.current.contains(event.target) != null) {
                
                // if (!dropDownRef.current.contains(event.target))
                if (!event.target.closest('.dropdown-container'))
                {
                    setIsDropdownOpen(false)
                }
            // }
        })

    }, [])

  React.useEffect(() => {

    const date = new Date();
    // const hour = date.getHours()
    const hour = 15

    if (themeMethod === "Auto")
    {
      if (hour >= 22) 
      {
        // localStorage.setItem('darkMode', 'enabled')
        // document.body.classList.remove('light')
        if (document.body.classList.contains('dark') || document.body.classList.contains('light'))
        {
          document.body.classList.remove('light')
          document.body.classList.toggle('dark')
          setDarkMode(true)
          // localStorage.setItem('themeMethod', 'Auto')
          // console.log("IM HERE")
        }
        else 
        {
          document.body.classList.add('dark')
          setDarkMode(true)
          // localStorage.setItem('themeMethod', 'Auto')
          // console.log("IM HERE")
        }
      } 
      else
      {
        if (document.body.classList.contains('dark') || document.body.classList.contains('light'))
          {
            document.body.classList.remove('dark')
            document.body.classList.add('light')
            
            localStorage.setItem('themeMethod', 'Auto')
            setDarkMode(false)
            // console.log("IM HERE")
            
          }
          else 
          {
            document.body.classList.add('light')
            
            localStorage.setItem('themeMethod', 'Auto')
            setDarkMode(false)
            // console.log("IM HERE")
          }
      }
    }
    else if (themeMethod === "Dark")
    {
      document.body.classList.remove('light')
      document.body.classList.add('dark')
      localStorage.setItem('themeMethod', 'Dark')
      setDarkMode(true)
    }
    else if (themeMethod === "Light")
    {
      document.body.classList.remove('dark')
      document.body.classList.add('light')
      localStorage.setItem('themeMethod', 'Light')
      setDarkMode(false)
    }

  }, [themeMethod])

  function handleThemes() {
    // setAllowAutoTheme(oldValue => !oldValue)
    const themeText = document.getElementById('themeText')

    if (themeText.innerHTML === "Auto")
    {
        themeText.innerHTML = "Light"
        localStorage.setItem('themeMethod', "Light")
        setThemeMethod("Light")
        // this.forceUpdate()

    }
    else if (themeText.innerHTML === "Light")
    {
        themeText.innerHTML = "Dark"
        localStorage.setItem('themeMethod', "Dark")
        setThemeMethod("Dark")
        // this.forceUpdate();
    }
    else 
    {
        themeText.innerHTML = "Auto"
        localStorage.setItem('themeMethod', "Auto")
        setThemeMethod("Auto")
        // this.forceUpdate();
    }
  }

    function handleDropdownMenu() {
        setIsDropdownOpen(oldIsDropdownOpen => oldIsDropdownOpen = !oldIsDropdownOpen)
    }

    var usernameStyle = {
        color: isDropdownOpen ? "#f05656" : (scrolled && (darkMode ? "white" : "black")),
        background: scrolled ? (darkMode ? "#2b2b2b" : "white") : (isDropdownOpen && (darkMode ? "#2b2b2b" : "white")),
        textShadow: isDropdownOpen && "none",
        zIndex: isDropdownOpen && "2",  
        transition:  scrolled && "none"
    }

    const avatarStyle = {
        background: darkMode ? "#2b2b2b" : "white",
        boxShadow:  isDropdownOpen && "none"
    }

    const dropdownStyle = {
        opacity: isDropdownOpen && "1",
        transform: isDropdownOpen && "translateY(0px)",
        pointerEvents: isDropdownOpen && "auto",
        borderTopLeftRadius: isDropdownOpen && "5px",
    }
    
    React.useEffect(() => {
        window.addEventListener('scroll', stickNavbar);
    }, [])

    const stickNavbar = () => {
        if (window !== undefined) {
        let windowHeight = window.scrollY;
        windowHeight > 4.5 && setScrolled(true)
        windowHeight == 0 && setScrolled(false)
        }
    }

    function handlePendingRev() {
        navigate('/pending-reviews', {
            state: {
              username: props.username,
              userId: props.userId
            }
        })
    }

    function handleYourAccount() {
        navigate('/your-account', {
            state: {
              username: props.username,
              userId: props.userId
            }
        })
    }

    async function handleLogout() {
        setError("")
  
        try {
            await logout()
            // navigate("/index")
        }
        catch {
            setError("Failed to log out.")
        }
    }

    function SlideOutMenu()
    {
        // var button_nav = document.getElementsByClassName("mobile-nav-toggle")
        var ul_nav = document.getElementById("navbar-links")
        var background = document.querySelector(".blurred-background")
        var icon = document.querySelector('.hamburger')


        const visibility = ul_nav.getAttribute('data-visible')

        if (visibility == "false") 
        {
            ul_nav.setAttribute('data-visible', 'true')
            background.style.visibility ="visible"
            background.style.opacity ="1"
            icon.classList.toggle("is-active")
        }
        else 
        {
            ul_nav.setAttribute('data-visible', 'false')
            background.style.visibility ="hidden"
            background.style.opacity ="0"
            icon.classList.remove("is-active")
        }
    }

    return (
        <>
            <nav className={props.isLoggedIn ? (props.isHome ? (scrolled ? "home-fixed-nav" : "home-nav") : "other-nav") : "login-nav"}>
            {/* <p onClick={handleLogout}>Log Out</p> */}
                <div className="navbar-logo-user">
                <Link className="link-logo" to="/"><img className="logo" src={foody_logo} alt="foody_logo"/></Link>
                {props.isLoggedIn === true && 
                <div ref={dropDownRef} className="dropdown-container">
                    <div className="dropdown-div">
                        {/* <button className="mobile-nav-toggle" onClick={SlideOutMenu}><Icon icon="charm:menu-hamburger" color="#ec2827" width="33" height="33" /></button> */}
                        <div onClick={SlideOutMenu} className="three col">
                            <div className="hamburger" id="hamburger-11">
                            <span className="line"></span>
                            <span className="line"></span>
                            <span className="line"></span>
                            </div>
                        </div>

                        <span className="span-user-avatar"><img style={avatarStyle} className="avatar" src="https://media.giphy.com/media/dxyawae0djPD2CTNyS/giphy.gif" /><p onClick={handleDropdownMenu} style={usernameStyle} className={props.isHome ? "nav-username-home" :"nav-username-other"}>{props.username}</p></span>
                        <div className="dropdown-menu" style={dropdownStyle}>
                            {props.isYourAccount !== true && <p className="dropdown-links" onClick={handleYourAccount}>Your Account</p>}
                            {props.isPending !== true && <p className="dropdown-links" onClick={handlePendingRev}>Pending Reviews</p>}
                            <div onClick={handleThemes} className="dropdown-links themeDiv">
                                <span>Theme: </span>
                                <span id="themeText">{themeMethod}</span>
                            </div>
                            
                            <p className="dropdown-links" onClick={handleLogout}>Log Out</p>
                        </div>
                    </div>
                </div>}   

                </div>

                <div className="blurred-background">

                </div>

                <div data-visible="false" id="navbar-links" className="navbar-links">
                    <span className="span-user-avatar-mobile"><img className="avatar-mobile" src="https://media.giphy.com/media/dxyawae0djPD2CTNyS/giphy.gif" /><p className="nav-username-mobile">{props.username}</p></span>
                    <ul>
                        <li>{props.isYourAccount !== true && <p className="dropdown-links" onClick={handleYourAccount}>Your Account</p>}</li>
                        <li>{props.isPending !== true && <p className="dropdown-links" onClick={handlePendingRev}>Pending Reviews</p>}</li>
                        <li><div onClick={handleThemes} className="dropdown-links themeDivMobile">
                                <span>Theme: </span>
                                <span id="themeText">{themeMethod}</span>
                            </div></li>
                        <li><p className="dropdown-links" onClick={handleLogout}>Log Out</p></li>
                    </ul>
                </div>

            </nav>

           

            
        </>
    )
}