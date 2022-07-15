import React from "react";
import ios from '../images/ios-app.png'
import android from '../images/android-app.png'
import { Icon } from '@iconify/react'
import './footer.css'

export default function Login(props) {

    const [darkMode, setDarkMode] = React.useState(false)

    function gotoGithub() {
        window.location.href='https://github.com/gniarchos/foody-react'
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
        <footer className={props.isLogin === true ? "footer-login" : "footer-global"}>

            {props.isLogin === true && <h2 className="download-text">Download the App </h2>}
            
            {props.isLogin === true && <div className="footer-download-app">
                <img className="app-download-img" src={ios} alt="ios"/>
                <img className="app-download-img" src={android} alt="android"/>
            </div>}

 
            {props.isLogin === false && <p>© 2022 Giannis Niarchos </p>}
            {props.isLogin === false && <div onClick={gotoGithub} className="github-div">
                <Icon className='git-img' icon="ant-design:github-filled" width="29" />
                <p>Made with React</p>
            </div>}
             

        
        </footer>
        
    )
}