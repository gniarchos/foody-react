import React from "react";
import foody_logo from '../images/foody-logo-nav-test.png'
import { Link } from "react-router-dom"
import location_img from '../images/location-mini.png'
import { Icon } from '@iconify/react';
import background_img from "../images/home-top-image.jpg"

export default function Navbar(props) {

    const [scrolled, setScrolled] = React.useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

    const navStyleHome = {
        height: !scrolled ? props.isHome && "300px" : "auto",
        boxShadow: props.isLoggedIn && (scrolled && "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px"),
        position: props.isLoggedIn ? (scrolled && "fixed") : "auto",
        top: "0",
        left: "0",
        width: props.isLoggedIn && "100vw",
        backgroundImage: props.isLoggedIn && props.isHome && (!scrolled && `url(${background_img})`),
        backgroundRepeat: props.isLoggedIn && "no-repeat",
        backgroundPosition: props.isLoggedIn && "center",
        backgroundSize: props.isLoggedIn && "cover",
        transition: "height 250ms ease-in-out"
    }

    function handleDropdownMenu() {
        setIsDropdownOpen(oldIsDropdownOpen => oldIsDropdownOpen = !oldIsDropdownOpen)
    }

    const usernameStyle = {
        color: isDropdownOpen ? "#f05656" : (scrolled && "black"),
        background: isDropdownOpen && "rgb(255, 255, 255, 1)",
        textShadow: isDropdownOpen && "none",
        zIndex: isDropdownOpen && "2",    
    }

    const avatarStyle = {
        background: "white",
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
        windowHeight > 15 && setScrolled(true)
        windowHeight == 0 && setScrolled(false)
        }
    }

    return (
        <>
            <nav style={navStyleHome} className={props.isLoggedIn ? (props.isHome ? "home-nav" : "other-nav") : "login-nav"}>

                <div className="navbar-logo-user">
                <Link to="/"><img className="logo" src={foody_logo} alt="foody_logo"/></Link>
                {props.isLoggedIn === true && 
                <div className="dropdown-container">
                    <div className="dropdown-div">
                        <span className="span-user-avatar"><Icon style={avatarStyle} className="avatar" icon="openmoji:drooling-face" width="45" /><p onClick={handleDropdownMenu} style={usernameStyle} className={props.isHome ? "nav-username-home" :"nav-username-other"}>{props.username}</p></span>
                        <div className="dropdown-menu" style={dropdownStyle}>
                            <Link to="/profile" className="dropdown-links">Profile</Link>
                            <Link to="/profile" className="dropdown-links">Edit Profile</Link>
                            <Link to="/profile" className="dropdown-links">Pending Reviews</Link>
                            <Link to="/index" className="dropdown-links" onClick={props.handleLogout}>Log Out</Link>
                            {/* {props.isLoggedIn && <button className="button-logout" onClick={props.handleLogout}>Log out</button>} */}
                        </div>
                    </div>
                </div>}

                </div>

                {/* {props.isLoggedIn && <button className="button-logout" onClick={props.handleLogout}>Log out</button>} */}

                {props.isHome && <div className="navbar-found-address">
                    {!scrolled && props.isLoggedIn && (!props.loading ? <h1 className="found-number">Found {props.storesCount} stores in {props.city}</h1> : <h1 className="found-number">Searching for stores. . .</h1>)}
                    
                    {!scrolled && props.isLoggedIn
                    && 
                    <div className="home-address">
                        <p className="address"><img src={location_img} alt="location-img" /> {props.address}</p>
                    </div>}
                </div>}
            </nav>
            
        </>
    )
}