import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import souvlaki_img from '../images/souvlaki-order.jpg'
import burger_img from '../images/burger-order.jpg'
import pizza_img from '../images/pizza-order.jpg'
import american_img from '../images/burger-order.jpg'
import cocktail_img from '../images/cocktail-order.jpg'
import coffee_img from '../images/coffee-order.jpg'
import brunch_img from '../images/brunch-order.jpg'
import noodles_img from '../images/noodles-order.jpg'
import checked_gif from '../images/checked.gif'
import { Icon } from '@iconify/react'
import "./orderSummary.css"

export default function OrderSummary() {

    const location = useLocation()
    // window.location.reload(true)
    // const history = useNavigate()

    document.title = `Foody | Your Order Summary `
    

    const [reloadGif, setReloadGif] = React.useState(checked_gif)
    const [randomDeliverTime, setRandomDeliverTime] = React.useState("")
    const [orderDate, setOrderDate] = React.useState("")
    const [orderTime, setOrderTime] = React.useState("")
    const [orderNumber, setOrderNumber] = React.useState("")
    const navigate = useNavigate ()
    // const randomDeliverTime = React.useRef("")
    const [darkMode, setDarkMode] = React.useState()
  
  //   React.useEffect(() => {
  
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
    

    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    React.useEffect(() => {
        // window.location.reload(true)
        setReloadGif("bg")
         

        let time = Math.floor(Math.random() * (70 - 15 + 1)) + 15
        setRandomDeliverTime(time)

        let random_orderNumber = Math.floor(Math.random() * (99999 + 1)) + 12345
        setOrderNumber(random_orderNumber)

        const today = new Date()

        const date =  today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear()
        setOrderDate(date)

        const cur_time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
        setOrderTime(cur_time)

        setTimeout(() => {
            setReloadGif(checked_gif)
        }, 0) 

    }, [])

    const sideImageByCateg = {
        backgroundImage: getImageCategory(),
        backgroundRepeat: "no-repeat",
        // backgroundPosition: "center -300px",
        // backgroundSize: "cover",
    }

    function getImageCategory() {
        switch(location.state.category) {
          case "Souvlaki": 
            return `url(${souvlaki_img})`
          case "Burger":
            return `url(${burger_img})`
          case "Pizza":
            return `url(${pizza_img})`
          case "American Burger":
              return `url(${american_img})`
          case "Cocktails":
            return `url(${cocktail_img})`
          case "Coffee":
            return `url(${coffee_img})`
          case "Brunch":
            return `url(${brunch_img})`
          case "Noodles":
            return `url(${noodles_img})`
          default:
            return null;
        }
      }

      function goBackHome() {
        navigate('/')
      }

    return (
        <div className='summary-layout'>
            <Navbar 
                isLoggedIn={true} 
                username={location.state.username}
                isHome={false}
                userId={location.state.userId}
            />
          <div>
            <div className='summary-container'>

                <div onClick={goBackHome} className='orderSummary-title'>
                    <div className='backIcon-div'>
                        <Icon icon="codicon:arrow-small-left" width="40px"/>
                        <h4>Back Home</h4>
                    </div>
                    
                    <h1 className='order-summary'>ORDER SUMMARY</h1>
                </div>

                <div className='order-info-container'>
                    <div style={sideImageByCateg} className='orderInfo-photo'>

                    </div>

                    <div className='orderInfo-wrapper'>

                        <div className="background"></div>
                        {/* <div className="background" id="background2"></div> */}

                        <div className='orderInfo-confirmed'>
                            <img className='check-img' src={reloadGif} />
                            <h2 className='confirmed-h2'>Your order is being proceeded.</h2>
                            <p className='subtitle-info'>The store has seen your order and it will be delivered to you in about {randomDeliverTime} minutes.</p>
                            <hr className='hr-orderSummary' />
                        </div>

                        <div className='orderInfo-details'>
                            <h4 className='title-details' >Store</h4>
                            <p className='subtitle-details'>{location.state.name}</p>

                            <h4 className='title-details' >Delivery Address</h4>
                            <p className='subtitle-details'>{location.state.address}, {location.state.city}</p>

                            <h4 className='title-details' >Order Number</h4>
                            <p className='subtitle-details'>#{orderNumber}</p>

                            <h4 className='title-details' >Date / Time</h4>
                            <p className='subtitle-details'>{orderTime} - {orderDate} </p>

                            <h4 className='title-details' >Payment Method</h4>
                            <p className='subtitle-details'>Cash</p>

                            <h4 className='title-details'>Total Price</h4>
                            <p className='subtitle-details'>{location.state.totalPrice} €</p>

                        </div>

                    </div>
                </div>
                {/* <p>{location.state.name}</p>
                <p>{location.state.category}</p>
                <p>{location.state.totalPrice}</p> */}
            </div>
          </div>

            <Footer isLogin={false}/>
            
        </div>
    )
}
