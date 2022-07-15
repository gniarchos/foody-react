import React from "react";
import './featured.css'

export default function Featured(props) {

    const [darkMode, setDarkMode] = React.useState(false)

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
        <div className="featured-cards">

          <img className="card-img" src={props.data.image}/>
          <div className="image-subtitle">
              
              <span className="feature-title">{props.data.name} </span>
              <span className="grey">{props.data.stars} ({props.data.reviews}) </span>
              
          </div>

          <p className="featured-category">{props.data.category}</p>
        </div>
        
    )

}