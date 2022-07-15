import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Navbar from './Navbar'
import souvlaki_img from '../images/souvlaki.jpg'
import burger_img from '../images/american.jpg'
import pizza_img from '../images/pizza.jpg'
import reviews_star from '../images/star.png'
// import american_img from '../images/american.jpg'
import cocktail_img from '../images/cocktail.jpg'
import coffee_img from '../images/coffee.jpg'
import brunch_img from '../images/brunch.jpg'
import noodles_img from '../images/noodles.jpg'
import { Icon } from '@iconify/react';
import { db} from "../services/firebase"
import { nanoid } from "nanoid"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import Footer from './Footer'
import { BounceLoader, SyncLoader } from 'react-spinners'
import denied_gif from '../images/denied.gif'
import "./menu.css"

export default function Menu() {
  
    const location = useLocation();

    document.title = `Foody | ${location.state.name} Menu `

    const [menu, setMenu] = React.useState([])
    const [cartItems, setCartItems] = React.useState([])
    const [scrolled, setScrolled] = React.useState(false)
    const [showItem, setShowItem] = React.useState(false)
    const [showReviews, setShowReviews] = React.useState(false)
    const [popupId, setPopupId] = React.useState("")
    const [popupItem, setPopupItem] = React.useState("")
    const [popupDesc, setPopupDesc] = React.useState("")
    const [popupPrice, setPopupPrice] = React.useState("")
    const [popupCategory, setPopupCategory] = React.useState("")
    const [popupAdults, setPopupAdults] = React.useState(false)
    const [isCartEmpty, setIsCartEmpty] = React.useState(true)
    // const [foundAdultItem, setFoundAdultItem] = React.useState(false)
    const [quantityNum, setQuantityNum] = React.useState(1)
    const [itemsNumber, setItemsNumber] = React.useState(1)
    const [totalPrice, setTotalPrice] = React.useState(0.00)
    const [coffeeSugar, setCoffeeSugar] = React.useState("")
    const [coffeeTypeSugar, setCoffeeTypeSugar] = React.useState("")
    const [coffeeSize, setCoffeeSize] = React.useState("")
    // const [noOptionSugar, setNoOptionSugar] = React.useState(true)
    // const [noOptionSize, setNoOptionSize] = React.useState(true)
    const [errorSugar, setErrorSugar] = React.useState(false)
    const [errorSize, setErrorSize] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [itemExists, setItemExists] = React.useState(false)
    const [itemId, setItemId] = React.useState("")
    const [storeReviews, setStoreReviews] = React.useState([])
    const [windowWidth, setWindowWidth] = React.useState()
    const [isCartOpen, setIsCartOpen] = React.useState(false)
    const [darkMode, setDarkMode] = React.useState()
    const [userOrders, setUserOrders] = React.useState()
    const navigate = useNavigate ()

    const [souvlakiCount, setSouvlakiCount] = React.useState(0)   
    const [pizzaCount, setPizzaCount] = React.useState(0) 
    const [cocktailsCount, setCocktailsCount] = React.useState(0) 
    const [brunchCount, setBrunchCount] = React.useState(0)
    const [burgerCount, setBurgerCount] = React.useState(0)
    const [coffeeCount, setCoffeeCount] = React.useState(0)
    const [noodlesCount, setNoodlesCount] = React.useState(0)

    const [isDiffLocations, setIsDiffLocations] = React.useState(false)
    const [reloadGif, setReloadGif] = React.useState(denied_gif)
    const [alertShow, setAlertShow] = React.useState(false)

    const [alertTitle, setAlertTitle] = React.useState("")
    const [cartEmpty, setCartEmpty] = React.useState("")
    const [minOrderAlert, setMinOrderAlert] = React.useState("")
    const [remainPrice, setRemainPrice] = React.useState("")
    const [adultsReason, setAdultsReason] = React.useState("")
    const [adultsRemove, setAdultsRemove] = React.useState("")

    const [isLoadingDataCart, setIsLoadingDataCart] = React.useState(true)

    React.useEffect(() => {

      if (location.state.city !== location.state.userLocation)
      {
        console.log("Oops... wrong city dude.")
        setIsDiffLocations(true)

        setReloadGif("bg")

        setTimeout(() => {
          setReloadGif(denied_gif)
      }, 0) 
      }
  
  
  }, [])

    const cat_0 = React.useRef(null)
    const cat_1 = React.useRef(null)
    const cat_2 = React.useRef(null)
    const cat_3 = React.useRef(null)
    const cat_4 = React.useRef(null)
    const cat_5 = React.useRef(null)
    const cat_6 = React.useRef(null)
    const cat_7 = React.useRef(null)

    const pushFilterStyle  = {
      top: scrolled && "0px"
  
    }

    React.useEffect(() => {
      window.scrollTo(0, 0)
    }, [location])

    function getImageCategory() {
      switch(location.state.category) {
        case "Souvlaki": 
          return `url(${souvlaki_img})`
        case "Burger":
          return `url(${burger_img})`
        case "Pizza":
          return `url(${pizza_img})`
        // case "American Burger":
        //     return `url(${american_img})`
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

    const topBackgroundByCateg = {
      backgroundImage: getImageCategory(),
      backgroundRepeat: "no-repeat",
      backgroundPosition: window.innerWidth < 500 ? "center -100px" : "center -300px",
      // backgroundSize: "cover",
      
    }

    const sendOrderStyle = {
      background: isCartEmpty && "#ffe591",
      color: isCartEmpty && "#666", // "#212529",
      cursor: isCartEmpty && "not-allowed"
    }

    let cat = location.state.category.toLowerCase()

    React.useEffect(() => {

      setIsLoadingDataCart(true)
      // setIsLoadingDataCart(false)

      db.collection(cat).onSnapshot(snapshot => {
        setMenu(snapshot.docs.map(doc => ({
          id:doc.id,
          item: doc.data().item,
          category: doc.data().category,
          desc: doc.data().desc,
          price: doc.data().price,
          adults_only: doc.data().adults_only
        })))
      })

      db.collection("users_orders").orderBy('id').onSnapshot(snapshot => {
        setCartItems(snapshot.docs.map(doc => ({
          id: doc.id,
          item: doc.data().user_id === location.state.userId && doc.data().store_name === location.state.name && doc.data().item,
          price: doc.data().user_id === location.state.userId && doc.data().store_name === location.state.name && doc.data().price,
          quantity: doc.data().user_id === location.state.userId && doc.data().store_name === location.state.name && doc.data().quantity,
          adults_only: doc.data().user_id === location.state.userId && doc.data().store_name === location.state.name && doc.data().adults_only,
          store_name: doc.data().user_id === location.state.userId && doc.data().store_name === location.state.name && doc.data().store_name

        })))

        
        setIsLoadingDataCart(false)

        var x = document.getElementById("dynamic-table").rows.length
        x > 0 && setIsCartEmpty(false)


      })


      db.collection("reviews").orderBy('timeDate', 'desc').onSnapshot(snapshot => {
        setStoreReviews(snapshot.docs.map(doc => ({
          // id: doc.id,
          store: doc.data().store,
          comment: doc.data().store === location.state.name && doc.data().comment === "" ? "No comments" : doc.data().comment,
          stars:  doc.data().store === location.state.name && doc.data().stars,
          timeDate: doc.data().store === location.state.name && doc.data().timeDate,
          user: doc.data().store === location.state.name && doc.data().user
        })))
      })

      db.collection('users').doc(location.state.userId).get().then(doc => {
        setUserOrders(doc.data().orders ? doc.data().orders : 0)
        setSouvlakiCount(doc.data().souvlaki)
        setPizzaCount(doc.data().pizza)
        setCocktailsCount(doc.data().cocktails)
        setBrunchCount(doc.data().brunch)
        setBurgerCount(doc.data().burger)
        setCoffeeCount(doc.data().coffee)
        setNoodlesCount(doc.data().noodles)
        // setCategoriesCount([doc.data().souvlaki, doc.data().pizza, doc.data().brunch, doc.data().coffee, doc.data().noodles, doc.data().cocktails, doc.data().burger])
      })

      // const index = categoriesCount.indexOf(Math.max(...categoriesCount))
    
      // console.log(`The max value is the ${index+1}nth value in the array`)
      // console.log(Math.max(...categoriesCount))

      


      return () => {
        setCartItems({})
        setStoreReviews({})
        setMenu({})
      }

    }, [])

    React.useEffect(() => {
      var priceCells = document.querySelectorAll('th:nth-child(4)')
      // var cellValues = []
      var total = 0
      let i = 0
      priceCells.forEach(function(singleCell) {
        if (i === 1)
        {
          var value = singleCell.innerText
          var price = parseFloat(value.substring(0, value.length - 1))
          // cellValues.push(price);
          total = total + price
        }
        i = 1
      })
      // console.log(cellValues);
      setTotalPrice(prevTotalPrice => prevTotalPrice = total.toFixed(2))
      // console.log(total.toFixed(2))

    }, [cartItems, isCartEmpty])

    window.onresize = function()
    {
      setWindowWidth(window.innerWidth)
    }
    
    let fixedCategStyle = {}
    let fixedCategContainer = {}
    let fixedCartContainer = {}
    let fixedCartStyle = {}

    React.useEffect(() => {

      if (window.innerWidth > 499 && window.innerWidth < 1156)
      {
        fixedCategContainer = {
          position: scrolled && "fixed",
          top: scrolled && "69px",
          zIndex: scrolled && "1000",
          backgroundColor: darkMode ? "#383838" : "none"
        }

        fixedCartContainer = {
          position: isCartOpen && "fixed",
          top: isCartOpen && "200px",
          background: isCartOpen && darkMode ? "#212121" : "white",
          width: isCartOpen && "60vw"
        }

      }
      else if (window.innerWidth < 499)
      {
        fixedCategContainer = {
          position: scrolled && "fixed",
          top: scrolled && "70px",
          zIndex: scrolled && "1000",
          overflowX: scrolled && "scroll"
        }

        fixedCartContainer = {
          position: isCartOpen && "fixed",
          top: isCartOpen && "200px",
          background: isCartOpen && darkMode ? "#212121" : "white",
          width: isCartOpen && "60vw"
        }
      }
      else {

        setIsCartOpen(false)
        
        // fixedCategContainer = {
          
        // }

        fixedCategStyle = {
          position: scrolled && "fixed",
          top: scrolled && "90px",
          right: scrolled && "84.5vw",
          width: scrolled && "10vw"
        }

        fixedCartContainer = {
          position: "relative",
          top: "0px",
          background: "none",
          width: "23vw",
          display: "flex",
          zIndex: "5000"
        }

        fixedCartContainer = {
          width: "60vw"
        }

        fixedCartStyle = {
          position: scrolled && isCartOpen === false && "fixed",
          top: scrolled && isCartOpen === false && "91px",
          left: scrolled && isCartOpen === false  && "77.8vw",
          width: scrolled && isCartOpen === false && "20vw",
        }
      }


    }, [windowWidth])


    if (window.innerWidth > 499 && window.innerWidth < 1156)
      {
        fixedCategContainer = {
          position: scrolled  && "fixed",
          top: scrolled && "69px",
          zIndex: scrolled && "1000",
          backgroundColor: darkMode ? "#383838" : "none"
        }

        // fixedCartContainer = {
        //   position: isCartOpen && "fixed",
        //   top: isCartOpen && "200px",
        //   background: isCartOpen && "white",
        //   width: isCartOpen && "60vw"
        // }

        fixedCartContainer = {
          position: isCartOpen && "fixed",
          top: isCartOpen && "200px",
          background: isCartOpen && darkMode ? "#212121" : "white",
          width: isCartOpen && "80vw",
          borderRadius: isCartOpen && "15px",
          padding: isCartOpen && "20px",
          // height: isCartOpen && "100vh",
          zIndex: isCartOpen && "5000"
        }
        

      }
      else if (window.innerWidth < 499)
      {
        fixedCategContainer = {
          position: scrolled && "fixed",
          top: scrolled && "70px",
          zIndex: scrolled && "1000",
          overflowX: scrolled && "scroll"
        }

        fixedCartContainer = {
          position: isCartOpen && "fixed",
          top: isCartOpen && "40px",
          background: isCartOpen && darkMode ? "#212121" : "white",
          width: isCartOpen && "90vw",
          borderRadius: isCartOpen && "15px",
          padding: isCartOpen && "20px",
          height: isCartOpen && "100vh",
          zIndex: isCartOpen && "5000"
        }

      }
      else {

        // fixedCategContainer = {
          
        // }

        fixedCategStyle = {
          position: scrolled && "fixed",
          top: scrolled && "90px",
          right: scrolled && "90.5vw",
          width: scrolled && "7vw"
        }

        fixedCartContainer = {
          position: "relative",
          top: "0px",
          background: "none",
          width: "23vw",
          display: "flex",
          zIndex: "8000"
        }

        fixedCartContainer = {
          display: "block"
        }

        fixedCartStyle = {
          position: scrolled && isCartOpen === false && "fixed",
          top: scrolled && isCartOpen === false && "91px",
          left: scrolled && isCartOpen === false  && "77.8vw",
          width: scrolled && isCartOpen === false && "20vw"
        }
      }

    const categoriesFixed = () => {
      if (window !== undefined) {
      let windowHeight = window.scrollY;
      windowHeight > 420 && setScrolled(true)
      windowHeight < 420 && setScrolled(false)
      }
    }

    React.useEffect(() => {
      window.addEventListener('scroll', categoriesFixed);
    }, [])

    const storeMenuCat_0 = menu.map(menu => {
      switch (location.state.category) {
        case "Souvlaki":
          return  menu.category === "starter" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Pizza":
          return  menu.category === "starters" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Cocktails":
          return  menu.category === "signa_cock" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Burger":
          return  menu.category === "starter" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Brunch":
          return  menu.category === "brunch" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Coffee":
        return  menu.category === "hot-coffees" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
          
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

        </div>
        case "Noodles":
          return  menu.category === "starters" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        default:
          return null
      }
    })

     const storeMenuCat_1 = menu.map(menu => {
      switch (location.state.category) {
        case "Souvlaki":
          return  menu.category === "salad" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Pizza":
          return  menu.category === "salads" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Cocktails":
          return  menu.category === "classics" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Burger":
          return  menu.category === "salads" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Brunch":
          return  menu.category === "mpares" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Coffee":
          return  menu.category === "cold-coffees" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        case "Noodles":
          return  menu.category === "salads" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        default:
          return null
      }
    })

     const storeMenuCat_2 = menu.map(menu => {
      switch (location.state.category) {
        case "Souvlaki":
          return  menu.category === "pites" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Pizza":
          return  menu.category === "pizzas" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Cocktails":
          return  menu.category === "spirits" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Burger":
          return  menu.category === "burgers" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Brunch":
          return  menu.category === "pancake-salty" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Coffee":
          return  menu.category === "chocolates" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        case "Noodles":
          return  menu.category === "piata" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        default:
          return null
      }
    })

     const storeMenuCat_3 = menu.map(menu => {
      switch (location.state.category) {
        case "Souvlaki":
          return  menu.category === "souvlaki" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Pizza":
          return  menu.category === "pasta" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Cocktails":
          return  menu.category === "no-alco" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Burger":
          return  menu.category === "merides" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Brunch":
          return  menu.category === "pancake-sweet" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Coffee":
          return  menu.category === "sweets" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        case "Noodles":
          return  menu.category === "drinks-tayland" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        default:
          return null
      }
    })

     const storeMenuCat_4 = menu.map(menu => {
      switch (location.state.category) {
        case "Souvlaki":
          return  menu.category === "poikilies" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Cocktails":
          return  menu.category === "snacks" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Burger":
          return  menu.category === "drinks" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Brunch":
          return  menu.category === "cold-coffees" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Coffee":
          return  menu.category === "drinks" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        case "Noodles":
          return  menu.category === "drinks" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        default:
          return null
      }
    })

     const storeMenuCat_5 = menu.map(menu => {
      switch (location.state.category) {
        case "Souvlaki":
          return  menu.category === "drinks" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Pizza":
          return  menu.category === "drinks" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Brunch":
          return  menu.category === "hot-coffees" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        case "Noodles":
          return  menu.category === "wine" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
            <p className='item'>{menu.item}</p>
            <p className='desc'>{menu.desc}</p>
            <p className='price'>{menu.price.toFixed(2)} €</p>
  
          </div>
        default:
          return null
      }
    })

     const storeMenuCat_6 = menu.map(menu => {
      switch (location.state.category) {
        case "Souvlaki":
          return  menu.category === "wine" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Pizza":
          return  menu.category === "wine" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div> 
        case "Burger":
          return  menu.category === "beers" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
            
          <p className='item'>{menu.item}</p>
          <p className='desc'>{menu.desc}</p>
          <p className='price'>{menu.price.toFixed(2)} €</p>

          </div>
        default:
          return null
      }
    })

    const storeMenuCat_7 = menu.map(menu => {
    switch (location.state.category) {
      case "Souvlaki":
        return  menu.category === "beer" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
          
        <p className='item'>{menu.item}</p>
        <p className='desc'>{menu.desc}</p>
        <p className='price'>{menu.price.toFixed(2)} €</p>

        </div> 
      case "Pizza":
        return  menu.category === "wine" && <div key={nanoid()} onClick={() => openPopup(menu.item, menu.desc, menu.price.toFixed(2), menu.adults_only, menu.id, menu.category)} className='menu-item'>
          
        <p className='item'>{menu.item}</p>
        <p className='desc'>{menu.desc}</p>
        <p className='price'>{menu.price.toFixed(2)} €</p>

        </div> 
      default:
        return null
    }
  })

  function handleClickCateg(ref) {

    ref.current.scrollIntoView({behavior: 'smooth'})
  
  }

  function openPopup(item, desc, price, adults_only, id, category) {
    
    // let counter = 0
    var number_quant = 1
    var position = -1
    // const found_item = []

      var itemsCells = document.querySelectorAll('th:nth-child(2)')
      // var cellValues = []
      let i = 0
      itemsCells.forEach(function(singleCell) {
        if (i >= 1)
        {
          if (singleCell.innerText === item)
          {
            console.log("Item already exists in cart")
            position = i
            setItemExists(true)

            var quantityCells = document.querySelectorAll('th:nth-child(3)')

            let j = 0
            quantityCells.forEach(function(singleCell) {
              if (j === position)
              {
                number_quant = singleCell.innerText
                // console.log(number_quant)
                // setItemCartQuantity(number_quant)
                setQuantityNum(prevVal => prevVal = parseInt(number_quant))
              }
              j++
            })

            var idCells = document.querySelectorAll('th:nth-child(1)')

            let k = 0
            idCells.forEach(function(singleCell) {
              if (k === position)
              {
                const item_id = singleCell.innerText
                // console.log(item_id)
                // setItemCartQuantity(number_quant)
                setItemId(prevVal => prevVal = item_id)
              }
              k++
            })
          }
        }
        i++
      })

    // console.log(id)
    setPopupId(id)
    setPopupItem(item)
    setPopupDesc(desc)
    setPopupPrice(price)
    setPopupAdults(adults_only)
    setShowItem(true)
    setPopupCategory(category)
    position === -1 && setQuantityNum(prevVal => prevVal = 1)
  
  }

  function closePopup() {
    setShowItem(false)
    setItemExists(false)
    // setErrorSize(false)
    // setErrorSugar(false)
    setCoffeeSize("")
    setCoffeeSugar("")
    // setItemCartQuantity(1)
  }

  function increaseQuantity() {
    setQuantityNum(prevVal => prevVal = prevVal + 1)
  }

  function decreaseQuantity() {
    setQuantityNum(prevVal => prevVal === 1 ? prevVal = 1 : prevVal = prevVal - 1)
  }

  async function addToOrder(item, price, quantity, adultsOnly, id, category, sugar, typeOfSugar, size) {
  
    const newPrice = price * quantity
    var str_sugar = ""
    var str_type = ""
    var str_size = ""
    var str_item = ""

    if (category === "cold-coffees" || category === "hot-coffees") {
      if (sugar === "glukos") {
        str_sugar = "Γλυκός"
        // setNoOptionSugar(false)
      }
      else if (sugar === "metrios") {
        str_sugar = "Μέτριος"
        // setNoOptionSugar(false)
      }
      else if (sugar === "sketos") {
        str_sugar = "Σκέτος"
        // setNoOptionSugar(false)
      }
      else if (sugar === "oligi") {
        str_sugar = "Ολίγη"
        // setNoOptionSugar(false)
      }
      else {
        setErrorSugar(true)
        str_sugar = ""
      }

      if (typeOfSugar === "kastani") {
        str_type = "Καστανή"
      }
      else if (typeOfSugar === "leuki") {
        str_type = "Λευκή"
      }
      else if (typeOfSugar === "stevia") {
        str_type = "Στέβια"
      }

      if (size === "single") {
        str_size = "Μονός"
        // setNoOptionSize(false)
      }
      else if (size === "double") {
        str_size = "Διπλός"
        // setNoOptionSize(false)
      }
      else {
        setErrorSize(true)
      }
    }

    if (str_type !== "")
    {
      str_item = item ==="Cappuccino" ? `${item} (${str_size}, ${str_sugar}, ${str_type})` : `${item} (${str_sugar}, ${str_type})`
    }
    else {
      str_item = item ==="Cappuccino" ? `${item} (${str_size}, ${str_sugar})` : `${item} (${str_sugar})`
    }

      function addToDatabase() {
        addDoc(collection(db, "users_orders"), {
          user_id: location.state.userId,
          item: (category === "cold-coffees" || category === "hot-coffees") ? str_item : item,
          price: JSON.parse(newPrice),
          adults_only: JSON.parse(adultsOnly),
          store_name: location.state.name,
          id: JSON.parse(itemsNumber),
          quantity: quantity
        })

        setItemsNumber(oldItemsNumber => oldItemsNumber = oldItemsNumber + 1)
        setShowItem(false)
        setIsCartEmpty(false)
        setErrorSize(false)
        setErrorSugar(false)
        setCoffeeSize("")
        setCoffeeSugar("")
      }

    // {(noOptionSize === false && noOptionSugar === false) && addToDatabase()}
    // {(coffeeSugar !== "" || coffeeSize !== "") && addToDatabase()}

    if (category !== "cold-coffees" && category !== "hot-coffees")
    {
      addToDatabase()
    }
    else {
      if (coffeeSugar !== "") {
        if(item === "Cappuccino")
        {
          if (coffeeSize !== "")
          {
            addToDatabase()
          }
          else {
            setErrorSize(true)
          }
        }
        else {
          addToDatabase()
        }
      }
      else {
        // setErrorSize(true)
        setErrorSugar(true)

      }
    }

    // {(category !== "cold-coffees" && category !== "hot-coffees") && addToDatabase()}

    // setItemsNumber(oldItemsNumber => oldItemsNumber = oldItemsNumber + 1)
    // setShowItem(false)
    // setIsCartEmpty(false)}
    
  }

  async function updateOrder(item, price, quantity, adultsOnly, id) {
    setShowItem(false)

    const newPrice = price * quantity
    
    db.collection("users_orders").doc(id).update({
      quantity: quantity,
      price: newPrice
    })

  }

  async function resetOrderCart() {

    var x = document.getElementById("dynamic-table").rows.length;
    
    await db.collection("users_orders").where("store_name", "==", location.state.name).get()
      .then(querySnapshot => {
        
        for (let i = 0; i < x-1; i++)
        {
          querySnapshot.docs[i].ref.delete()
        }
      })

      setIsCartEmpty(true)
  }

  function removeFromCart(itemToDelete) {

    db.collection("users_orders").where("item", "==", itemToDelete).get()
      .then(querySnapshot => {
        querySnapshot.docs[0].ref.delete();
      })

    setTimeout(() => {
      const x = document.getElementById("dynamic-table").rows.length;
      x <= 1 && setIsCartEmpty(true)
    }, 200)

  }

  function sendOrderFunctions() {
    const x = document.getElementById("dynamic-table").rows.length

          addDoc(collection(db, "pending-reviews"), {
            user_id: location.state.userId,
            store_name: location.state.name,
            date_time: serverTimestamp(),
            store_id: location.state.store_id
          })

          var found_store = 0
          db.collection(`order_history-${location.state.userId}`).where("store_name", "==", location.state.name).get()
          .then(snapshot => {  
            found_store = snapshot.size
            // console.log(snapshot.size)
            if (found_store > 0)
            {
              console.log("Store already exists")

              db.collection(`order_history-${location.state.userId}`).where("store_name", "==", location.state.name).get()
              .then(querySnapshot => {
                querySnapshot.docs[0].ref.delete();

                addDoc(collection(db, `order_history-${location.state.userId}`), {
                  user_id: location.state.userId,
                  store_name: location.state.name,
                  // date_time: `${date} ${cur_time}`,
                  // date_time: db.serverTimestamp(),
                  date_time: serverTimestamp(),
                  store_id: location.state.store_id,
                  location: location.state.city,
                  category: location.state.category,
                  min_order: parseFloat(location.state.minOrder),
                  reviews: location.state.reviews,
                  stars: parseFloat(location.state.stars)
                })
                
              })
              
            }
            else 
            {

              addDoc(collection(db, `order_history-${location.state.userId}`), {
                user_id: location.state.userId,
                store_name: location.state.name,
                // date_time: `${date} ${cur_time}`,
                // date_time: db.serverTimestamp(),
                date_time: serverTimestamp(),
                store_id: location.state.store_id,
                location: location.state.city,
                category: location.state.category,
                min_order: parseFloat(location.state.minOrder),
                reviews: location.state.reviews,
                stars: parseFloat(location.state.stars)
              })
            }


          })
    
          
          db.collection("users_orders").where("store_name", "==", location.state.name).get()
            .then(querySnapshot => {
              for (let i = 0; i < x; i++)
                querySnapshot.docs[i].ref.delete();
            })

          if (location.state.category === "Souvlaki")
          {
            db.collection("users").doc(location.state.userId).update({
              orders: parseInt(userOrders) + 1,
              souvlaki: parseInt(souvlakiCount) + 1
            })
          }
          else if (location.state.category === "Pizza")
          {
            db.collection("users").doc(location.state.userId).update({
              orders: parseInt(userOrders) + 1,
              pizza: parseInt(pizzaCount) + 1
            })
          }
          else if (location.state.category === "Brunch")
          {
            db.collection("users").doc(location.state.userId).update({
              orders: parseInt(userOrders) + 1,
              brunch: parseInt(brunchCount) + 1
            })
          }
          else if (location.state.category === "Burger")
          {
            db.collection("users").doc(location.state.userId).update({
              orders: parseInt(userOrders) + 1,
              burger: parseInt(burgerCount) + 1
            })
          }
          else if (location.state.category === "Coffee")
          {
            db.collection("users").doc(location.state.userId).update({
              orders: parseInt(userOrders) + 1,
              coffee: parseInt(coffeeCount) + 1
            })
          }
          else if (location.state.category === "Noodles")
          {
            db.collection("users").doc(location.state.userId).update({
              orders: parseInt(userOrders) + 1,
              noodles: parseInt(noodlesCount) + 1
            })
          }
          else if (location.state.category === "Cocktails")
          {
            db.collection("users").doc(location.state.userId).update({
              orders: parseInt(userOrders) + 1,
              cocktails: parseInt(cocktailsCount) + 1
            })
          }

          setTimeout(() => {
            navigate('/order-summary', {
              state: {
                name: location.state.name,
                category: location.state.category,
                username: location.state.username,
                totalPrice: totalPrice,
                address: location.state.address,
                city: location.state.city,
                userId: location.state.userId
              }
            })
          }, 5000)
  }

  async function sendOrder() {

    var x = document.getElementById("dynamic-table").rows.length;

    if (x <= 1)
    {
      // console.log("Cant send order if cart is empty.")
      // alert("Can't send order if cart is empty.")

      setAlertTitle("Something went wrong!")
      setCartEmpty("• Add items in cart and try again.")
      setMinOrderAlert("")
      setRemainPrice("")
      setAdultsReason("")
      setAdultsRemove("")
      setAlertShow(true)
    }
    else {

      if (parseFloat(totalPrice) < parseFloat(location.state.minOrder))
      {

        var remain = parseFloat(location.state.minOrder - totalPrice).toFixed(2)

        // alert("Your total order price is lower than minimum order price.")
        setAlertTitle("Something went wrong!")
        setCartEmpty("")
        setMinOrderAlert("• Make order over "+ location.state.minOrder +" € and try again.")
        setRemainPrice("• You need additional "+ remain +" € for minimum order.")
        setAdultsReason("")
        setAdultsRemove("")
        setAlertShow(true)
      }
      else
      {

        setIsCartOpen(false)
        if (window.innerWidth < 499) {
          var cart = document.getElementsByClassName("menu-cart-div")[0]
          cart.style.display = "none"
        }

        var priceCells = document.querySelectorAll('th:nth-child(6)')
        var foundAdultOnlyItem = false
        // setFoundAdultOnlyItem(true)
        let i = 0
        priceCells.forEach(function(singleCell) {
          if (i === 1)
          {
            var value = singleCell.innerText
            console.log(value)
            if (parseInt(value) === 1)
            {
              foundAdultOnlyItem = true
              // setFoundAdultOnlyItem(true)
            }

          }
          i = 1
        })

        if (parseInt(location.state.age) > 18)
        {
          setIsLoading(true)
          sendOrderFunctions()
        }
        else {

          if (foundAdultOnlyItem === true) 
          {
            // console.log("Warning: User's age is under 18.")
            setAlertTitle("Alcohol item(s) detected in your cart")
            setCartEmpty("")
            setMinOrderAlert("")
            setRemainPrice("")
            setAdultsReason("• These items are 18+ only.")
            setAdultsRemove("• Remove any alcohol items and try again.")
            setAlertShow(true)
          }
          else 
          {
            setIsLoading(true)
            sendOrderFunctions()
          }
        }
      }
    }
  }


  // console.log(foundAdultOnlyItem)

  function handleRadioSugar(event) {
    const {value} = event.target
    // console.log(value)
    setCoffeeSugar(value)
  }

  function handleRadioTypeSugar(event) {
    const {value} = event.target
    // console.log(value)
    setCoffeeTypeSugar(value)
  }

  function handleCoffeeSize(event) {
    const {value} = event.target
    // console.log(value)
    setCoffeeSize(value)

    if (value === "double") {
      const addPrice = parseFloat(popupPrice) + 0.30
      // console.log(addPrice)
      setPopupPrice(addPrice.toFixed(2))
    }
    else if (value === "single") {
      // const addPrice = parseFloat(popupPrice) + 0.30
      // console.log(addPrice)
      setPopupPrice("1.80")
    }
  }

  function openReviews() {
    console.log("Opening Reviews Popup...")

    // const modal = document.getElementById("reviews-dialog")
    // modal.showModal()  
    setShowReviews(true)

  }

  function  closeReviews() {
    console.log("Closing Reviews Popup...")

    // const modal = document.getElementById("reviews-dialog")
    // modal.close()
    setShowReviews(false)
  }

  function toggleCart() {
    var cart = document.getElementsByClassName("menu-cart-div")[0]

    if (isCartOpen === false)
    {
      setIsCartOpen(true)
      cart.style.display = "block"
    }
    else 
    {
      setIsCartOpen(false)
      cart.style.display = "none"
    }
    
  }

  // const [noData, setNoData] = React.useState(false)

  function closeAlert() {
    setAlertShow(false)
  }

  const allReviews = storeReviews.map(rev => {

      return  ( rev.store === location.state.name && //&& rev.comment !== ""
        <div key={nanoid()} className='div-reviews'>
          <p className='username-rev'><Icon icon="carbon:user-avatar-filled" />{rev.user ? rev.user : "Unknown User"}</p>
          {rev.stars === 5 && 
            <div className='div-stars'>
              <img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" />
            </div>
          }
          
          {rev.stars === 4 && 
            <div className='div-stars'>
              <img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" />
            </div>
          }
    
          {rev.stars === 3 && 
            <div className='div-stars'>
              <img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" />
            </div>
          }
    
          {rev.stars === 2 && 
            <div className='div-stars'>
              <img className='rev-stars' src={reviews_star} alt="stars" /><img className='rev-stars' src={reviews_star} alt="stars" />
            </div>
          }
          
          {rev.stars === 1 && 
            <div className='div-stars'>
              <img className='rev-stars' src={reviews_star} alt="stars" />
            </div>
          }
    
          <div className='div-comment'>
            {rev.comment === "No comments" ? <p className='rev-comment-no'>{rev.comment}</p> : <p className='rev-comment'>{rev.comment}</p>}
            <p className='timeDate-rev'>{rev.timeDate.toDate().toDateString()}</p>
          </div> 
          
          {/* <p key={nanoid()}>{rev.stars}</p> */}
        </div>)
    })

    const override = `
    display: block;
    margin: 0 auto;
  `;

  return (
    <div>
      <Navbar 
        isLoggedIn={true} 
        username={location.state.username}
        isHome={false}
        userId={location.state.userId}
        
      />

    {alertShow && <div id="alert-info" className="alert-info">

      {/* Alert info */}
      <div className="details-alert">
        <span onClick={closeAlert} className="close">&times;</span>
        
          
          <p className="alert-title"><Icon icon="noto-v1:warning" width={30}/> {alertTitle}</p>
       
        {/* <p className="alert-title"> {alertTitle}</p> */}
        <p className="info-text">{cartEmpty}</p>
        <p className="info-text">{minOrderAlert}</p>
        <p className="info-text">{remainPrice}</p>
        <p className="info-text">{adultsReason}</p>
        <p className="info-text">{adultsRemove}</p>
      </div>

    </div>}

    {isLoading && <div style={pushFilterStyle} className='popup-bg-menu'>
      <div className='loader' align="center">
        <BounceLoader color={'#ffc200'} css={override} size={130}/> 
        <h2 style={{color: "#ffc200"}} >Sending Order. . . </h2> 
        <h3 style={{color: "#ffc200"}} >The store will accept your order in a few seconds. </h3> 
        <h3 style={{color: "#D3D3D3", fontSize: "1rem"}} >Please do not close the window or refresh page. </h3>
      </div>
    </div>}

    {isDiffLocations && <div style={pushFilterStyle} className='popup-bg-menu'>
      <div className='loader' align="center">
      <img className='check-img' src={reloadGif} /> 
        <h2 style={{color: "#ec2827"}} >Access Denied. </h2> 
        <h3 style={{color: "white"}} >Your current location has been set to <i>{location.state.userLocation}</i>. </h3> 
        <h3 style={{color: "#D3D3D3", fontSize: "1rem"}} >This store doesn't deliver to your location. </h3>
      </div>
    </div>}

      <button onClick={toggleCart} className='btn-showCart-fixed'><Icon icon="noto-v1:shopping-cart" width="30" /></button>

      <div>
        <div style={topBackgroundByCateg} className='div-img-menu-top'>
          {/* {location.state.category === "Souvlaki" && <img className='div-img-menu-top' src={souvlaki_img} alt="souvlaki-menu"/>} */}
          <h1 className='store-name-menu'>{location.state.name}</h1>

          <div className='info-menu-container'>
            {/* <h1 className='stars-emoji-menu'><Icon className='emoji-menu-icon' icon="emojione:smiling-face-with-heart-eyes" width="30"/> {location.state.stars}</h1> */}
            
            <h1 onClick={openReviews} className='stars-emoji-menu'><img className='emoji-menu-icon' src="https://media.giphy.com/media/Wm8h2gyEY8VnJeru6f/giphy.gif" alt="reviews-gif" />{location.state.stars.toFixed(1)}</h1>
            <h3 className='other-info-menu'><b>Minimum Order:</b> {location.state.minOrder}  € </h3>
            <h3 className='other-info-menu'><b>Category:</b> {location.state.category}</h3>
          </div>
        </div>
        
        <div className='menu-container-div'>
          <div style={fixedCategContainer} className='menu-categories-container'>
            {/* <h2>Categories</h2> */}
            {location.state.category === "Souvlaki" && <div style={fixedCategStyle} className='menu-categories-div'>
              <p onClick={() => handleClickCateg(cat_0)}className='menu-categories'>Ορεκτικά</p>
              <p onClick={() => handleClickCateg(cat_1)} className='menu-categories'>Σαλάτες</p>
              <p onClick={() => handleClickCateg(cat_2)} className='menu-categories'>Τυλικτά</p>
              <p onClick={() => handleClickCateg(cat_3)} className='menu-categories'>Καλαμάκια</p>
              <p onClick={() => handleClickCateg(cat_4)} className='menu-categories'>Ποικιλίες</p>
              <p onClick={() => handleClickCateg(cat_5)} className='menu-categories'>Αναψυκτικά</p>
              <p onClick={() => handleClickCateg(cat_6)} className='menu-categories'>Κρασιά</p>
              <p onClick={() => handleClickCateg(cat_7)} className='menu-categories'>Μπύρες</p>
            </div>}

            {location.state.category === "Pizza" && <div style={fixedCategStyle} className='menu-categories-div'>
              <p onClick={() => handleClickCateg(cat_0)}className='menu-categories'>Ορεκτικά</p>
              <p onClick={() => handleClickCateg(cat_1)} className='menu-categories'>Σαλάτες</p>
              <p onClick={() => handleClickCateg(cat_2)} className='menu-categories'>Πίτσες</p>
              <p onClick={() => handleClickCateg(cat_3)} className='menu-categories'>Pasta</p>
              {/* <p onClick={() => handleClickCateg(cat_4)} className='menu-categories'>Ποικιλίες</p> */}
              <p onClick={() => handleClickCateg(cat_5)} className='menu-categories'>Αναψυκτικά</p>
              <p onClick={() => handleClickCateg(cat_6)} className='menu-categories'>Κρασιά</p>
              <p onClick={() => handleClickCateg(cat_7)} className='menu-categories'>Μπύρες</p>
            </div>}

            {location.state.category === "Cocktails" && <div style={fixedCategStyle} className='menu-categories-div'>
              <p onClick={() => handleClickCateg(cat_0)}className='menu-categories'>Signature Cocktails</p>
              <p onClick={() => handleClickCateg(cat_1)} className='menu-categories'>Classics</p>
              <p onClick={() => handleClickCateg(cat_2)} className='menu-categories'>Spirits</p>
              <p onClick={() => handleClickCateg(cat_3)} className='menu-categories'>Non Alcoholic</p>
              <p onClick={() => handleClickCateg(cat_4)} className='menu-categories'>Snacks</p>
            </div>}

            {location.state.category === "Brunch" && <div style={fixedCategStyle} className='menu-categories-div'>
              <p onClick={() => handleClickCateg(cat_0)}className='menu-categories'>Brunch</p>
              <p onClick={() => handleClickCateg(cat_1)} className='menu-categories'>Μπάρες Δημητριακών</p>
              <p onClick={() => handleClickCateg(cat_2)} className='menu-categories'>Pancakes Αλμυρά</p>
              <p onClick={() => handleClickCateg(cat_3)} className='menu-categories'>Pancakes Γλυκά</p>
              <p onClick={() => handleClickCateg(cat_4)} className='menu-categories'>Ice Coffees</p>
              <p onClick={() => handleClickCateg(cat_5)} className='menu-categories'>Hot Coffees</p>
            </div>}

            {location.state.category === "Burger" && <div style={fixedCategStyle} className='menu-categories-div'>
              <p onClick={() => handleClickCateg(cat_0)}className='menu-categories'>Ορεκτικά</p>
              <p onClick={() => handleClickCateg(cat_1)} className='menu-categories'>Σαλάτες</p>
              <p onClick={() => handleClickCateg(cat_2)} className='menu-categories'>Burgers</p>
              <p onClick={() => handleClickCateg(cat_3)} className='menu-categories'>Μερίδες</p>
              <p onClick={() => handleClickCateg(cat_4)} className='menu-categories'>Αναψυκτικά</p>
              <p onClick={() => handleClickCateg(cat_6)} className='menu-categories'>Μπύρες</p>
            </div>}

            {location.state.category === "Noodles" && <div style={fixedCategStyle} className='menu-categories-div'>
              <p onClick={() => handleClickCateg(cat_0)}className='menu-categories'>Ορεκτικά</p>
              <p onClick={() => handleClickCateg(cat_1)} className='menu-categories'>Σαλάτες</p>
              <p onClick={() => handleClickCateg(cat_2)} className='menu-categories'>Πιάτα</p>
              <p onClick={() => handleClickCateg(cat_4)} className='menu-categories'>Αναψυκτικά Ταϋλάνδης</p>
              <p onClick={() => handleClickCateg(cat_5)} className='menu-categories'>Αναψυκτικά</p>
              <p onClick={() => handleClickCateg(cat_6)} className='menu-categories'>Κρασιά</p>
            </div>}

            {location.state.category === "Coffee" && <div style={fixedCategStyle} className='menu-categories-div'>
              <p onClick={() => handleClickCateg(cat_0)}className='menu-categories'>Καφέδες Ζεστοί</p>
              <p onClick={() => handleClickCateg(cat_1)} className='menu-categories'>Καφέδες Κρύοι</p>
              <p onClick={() => handleClickCateg(cat_2)} className='menu-categories'>Σοκολάτες</p>
              <p onClick={() => handleClickCateg(cat_3)} className='menu-categories'>Γλυκά</p>
              <p onClick={() => handleClickCateg(cat_4)} className='menu-categories'>Αναψυκτικά</p>
            </div>}

          </div>
          {location.state.category === "Souvlaki" && <div className='menu-items-div'>
            <h1 ref={cat_0}>Ορεκτικά</h1>
            {storeMenuCat_0}
            <h1 ref={cat_1}>Σαλάτες</h1>
            {storeMenuCat_1}
            <h1 ref={cat_2}>Τυλικτά</h1>
            {storeMenuCat_2}
            <h1 ref={cat_3}>Καλαμάκια</h1>
            {storeMenuCat_3}
            <h1 ref={cat_4}>Ποικιλίες</h1>
            {storeMenuCat_4}
            <h1 ref={cat_5}>Αναψυκτικά</h1>
            {storeMenuCat_5}
            <h1 ref={cat_6}>Κρασιά</h1>
            {storeMenuCat_6}
            <h1 ref={cat_7}>Μπύρες</h1>
            {storeMenuCat_7}
          </div>}

          {location.state.category === "Pizza" && <div className='menu-items-div'>
            <h1 ref={cat_0}>Ορεκτικά</h1>
            {storeMenuCat_0}
            <h1 ref={cat_1}>Σαλάτες</h1>
            {storeMenuCat_1}
            <h1 ref={cat_2}>Πίτσες</h1>
            {storeMenuCat_2}
            <h1 ref={cat_3}>Pasta</h1>
            {storeMenuCat_3}
            <h1 ref={cat_5}>Αναψυκτικά</h1>
            {storeMenuCat_5}
            <h1 ref={cat_6}>Κρασιά</h1>
            {storeMenuCat_6}
            <h1 ref={cat_7}>Μπύρες</h1>
            {storeMenuCat_7}
          </div>}

          {location.state.category === "Cocktails" && <div className='menu-items-div'>
            <h1 ref={cat_0}>Signature Cocktails</h1>
            {storeMenuCat_0}
            <h1 ref={cat_1}>Classics</h1>
            {storeMenuCat_1}
            <h1 ref={cat_2}>Spirits</h1>
            {storeMenuCat_2}
            <h1 ref={cat_3}>Non Alcoholic</h1>
            {storeMenuCat_3}
            <h1 ref={cat_4}>Snacks</h1>
            {storeMenuCat_4}
          </div>}

          {location.state.category === "Burger"  && <div className='menu-items-div'>
            <h1 ref={cat_0}>Ορεκτικά</h1>
            {storeMenuCat_0}
            <h1 ref={cat_1}>Σαλάτες</h1>
            {storeMenuCat_1}
            <h1 ref={cat_2}>Burgers</h1>
            {storeMenuCat_2}
            <h1 ref={cat_3}>Μερίδες</h1>
            {storeMenuCat_3}
            <h1 ref={cat_4}>Αναψυκτικά</h1>
            {storeMenuCat_4}
            <h1 ref={cat_6}>Μπύρες</h1>
            {storeMenuCat_6}
          </div>}

          {location.state.category === "Brunch"  && <div className='menu-items-div'>
            <h1 ref={cat_0}>Brunch</h1>
            {storeMenuCat_0}
            <h1 ref={cat_1}>Μπάρες Δημητριακών</h1>
            {storeMenuCat_1}
            <h1 ref={cat_2}>Pancakes Αλμυρά</h1>
            {storeMenuCat_2}
            <h1 ref={cat_3}>Pancakes Γλυκά</h1>
            {storeMenuCat_3}
            <h1 ref={cat_4}>Ice Coffees</h1>
            {storeMenuCat_4}
            <h1 ref={cat_5}>Hot Coffees</h1>
            {storeMenuCat_5}
          </div>}

          {location.state.category === "Coffee"  && <div className='menu-items-div'>
            <h1 ref={cat_0}>Καφέδες Ζεστοί</h1>
            {storeMenuCat_0}
            <h1 ref={cat_1}>Καφέδες Κρύοι</h1>
            {storeMenuCat_1}
            <h1 ref={cat_2}>Σοκολάτες</h1>
            {storeMenuCat_2}
            <h1 ref={cat_3}>Γλυκά</h1>
            {storeMenuCat_3}
            <h1 ref={cat_4}>Αναψυκτικά</h1>
            {storeMenuCat_4}
          </div>}

          {location.state.category === "Noodles"  && <div className='menu-items-div'>
            <h1 ref={cat_0}>Ορεκτικά</h1>
            {storeMenuCat_0}
            <h1 ref={cat_1}>Σαλάτες</h1>
            {storeMenuCat_1}
            <h1 ref={cat_2}>Πιάτα</h1>
            {storeMenuCat_2}
            <h1 ref={cat_3}>Αναψυκτικά Ταϋλάνδης</h1>
            {storeMenuCat_3}
            <h1 ref={cat_4}>Αναψυκτικά</h1>
            {storeMenuCat_4}
            <h1 ref={cat_5}>Κρασιά</h1>
            {storeMenuCat_5}
          </div>}

          <div className={isCartOpen ? 'popup-bg-menu' : ""}></div>

          <div style={fixedCartContainer} className='menu-cart-div' >
            <div style={fixedCartStyle}>
              <div className='cartTitle-removeBtn'>
                <h2>Your Order</h2> 
                {isCartEmpty === false && <button onClick={resetOrderCart} type="button" className="btn-clear-order" ><Icon icon="ri:delete-bin-2-fill" width="18px" /> Clear All</button>}
              </div>
              
              {/* TODO: REFACTOR TABLE CODE WITH USESTATE AND MAPING ELEMENTS WITH DIVS OR INPUTS */}           
              <div className='cart-div'>

              {isLoadingDataCart && <div className='loading'> 
                  <SyncLoader color={'#ffce30'} size={20}/> 
              </div>}

              {isCartEmpty && !isLoadingDataCart && <div className='empty-cart-div'> 
                        <img className='empty-cart-gif' src="https://media.giphy.com/media/VDNDX5BhKKz0YsJkl0/giphy.gif" alt="no-items-gif" /> 
                        <h2 className='cart-talk'>I feel so hungry.</h2> 
                        <h2 className='cart-talk'>Feed me by adding products.</h2>
                  </div>}



                <div className='table-div'>
                  <table id="dynamic-table" className="dynamic-table">
                    <tbody>
                    {!isCartEmpty && !isLoadingDataCart && <tr>
                        <th hidden>ID</th>
                        <th className="table-items">ITEM</th>
                        <th className="table-quantity">QUANTITY</th>
                        <th className="table-price">PRICE</th>
                        <th className="table-remove"> </th>
                        <th hidden>Adults</th>     
                      </tr>}
                      {cartItems.map(cart_item => {
                        return cart_item.store_name === location.state.name && <tr key={nanoid()}>
                            
                        <th >{cart_item.id}</th>
                        <th >{cart_item.item}</th>
                        <th >{cart_item.quantity}</th>
                        <th >{cart_item.price.toFixed(2)} €</th>
                        <th> <button onClick={() => removeFromCart(cart_item.item)} className='btn-removeItem'><Icon icon="oi:circle-x" color="#c02525" width="18px"/></button> </th>
                        <th >{cart_item.adults_only === false ? 0 : 1}</th>

                        </tr> }) }
                      
                      
                      
                    </tbody>
                  </table>
              </div>
              <h3>Total: {totalPrice} €</h3>
              <div className='cartButtons'>
                <button onClick={sendOrder} style={sendOrderStyle} type="submit" className="btn-send-order" >Send Order</button>
                
              </div>
              </div>
            </div>
          </div>

        </div>
        
      </div>

      {showItem 
      && 
      <div style={pushFilterStyle} className='popup-bg-menu'>
        <div className={(popupCategory === "cold-coffees" || popupCategory === "hot-coffees") ? 'popup-div-coffee' : 'popup-div-menu'}>
          <span className="close" onClick={closePopup}>&times;</span>

          <h2 className='popupItem'>{popupItem}</h2>
          <p className='popupDesc'>{popupDesc}</p>
          <p className='popupPrice'>{popupPrice} €</p>
          <p hidden>{popupAdults}</p>
          {(errorSize || errorSugar) && <p>Please select the required (*) details. </p>}

          {(popupCategory === "cold-coffees" || popupCategory === "hot-coffees") && 
          <div className='coffee-options'>
            {popupItem === "Cappuccino" && 
            <>
              <h4>Μέγεθος *</h4>

              <div className='coffee-size'>
          
                <label className="rad-label">
                <input onChange={(e) => handleCoffeeSize(e)} value="single" type="radio" className="rad-input" name="size" required/>
                <div className="rad-design"></div>
                <div className="rad-text">Μονος</div>
                </label>

                <label className="rad-label">
                  <input onChange={(e) => handleCoffeeSize(e)} value="double" type="radio" className="rad-input" name="size" required/>
                  <div className="rad-design"></div>
                  <div className="rad-text">Διπλος (+0.30 €)</div>
                </label>
              </div>
            </>
          }
          
            <h4>Ζάχαρη *</h4>
            <label className="rad-label">
              <input onChange={(e) => handleRadioSugar(e)} value="glukos" type="radio" className="rad-input" name="sugar" required/>
              <div className="rad-design"></div>
              <div className="rad-text">Γλυκος</div>
            </label>

            <label className="rad-label">
              <input onChange={(e) => handleRadioSugar(e)} value="metrios" type="radio" className="rad-input" name="sugar" required/>
              <div className="rad-design"></div>
              <div className="rad-text">Μετριος</div>
            </label>

            <label className="rad-label">
              <input onChange={(e) => handleRadioSugar(e)} value="sketos" type="radio" className="rad-input" name="sugar" required/>
              <div className="rad-design"></div>
              <div className="rad-text">Σκετος</div>
            </label>

            <label className="rad-label">
              <input onChange={(e) => handleRadioSugar(e)} value="oligi" type="radio" className="rad-input" name="sugar" required/>
              <div className="rad-design"></div>
              <div className="rad-text">Με ολιγη</div>
            </label>

            <h4>Είδος Ζάχαρης</h4>
            <label className="rad-label">
              <input type="radio" onChange={(e) => handleRadioTypeSugar(e)} value="leuki" className="rad-input" name="type-sugar"/>
              <div className="rad-design"></div>
              <div className="rad-text">Λευκη</div>
            </label>

            <label className="rad-label">
              <input type="radio" onChange={(e) => handleRadioTypeSugar(e)} value="kastani" className="rad-input" name="type-sugar"/>
              <div className="rad-design"></div>
              <div className="rad-text">Καστανη</div>
            </label>

            <label className="rad-label">
              <input type="radio" onChange={(e) => handleRadioTypeSugar(e)} value="stevia" className="rad-input" name="type-sugar"/>
              <div className="rad-design"></div>
              <div className="rad-text">Στεβια</div>
            </label>
          </div>
          
          
          }


          <div className='popupItemAdd'>
            <div className='quantity-wrapper'>
              <a id="minus" className="minus-item" onClick={decreaseQuantity}>-</a>
              <input type="number" className="input-quantity" id="quantity-input" value={quantityNum} name="quantity" min="1" readOnly />
              <a id="add" className="plus-item" onClick={increaseQuantity}>+</a>
            </div>

            {itemExists === false || (popupCategory === "cold-coffees" || popupCategory === "hot-coffees") ? <button onClick={() => addToOrder(popupItem, popupPrice, quantityNum, popupAdults, popupId, popupCategory, coffeeSugar, coffeeTypeSugar, coffeeSize)} className='btn-addItem'>Add to Order</button> : 
            <button onClick={() => updateOrder(popupItem, popupPrice, quantityNum, popupAdults, itemId)} className='btn-addItem'>Update Order</button>}
          </div>
          
        </div>
      </div>}

      {/* <dialog className='reviews-dialog' id="reviews-dialog"> */}
      {showReviews 
      && <div style={pushFilterStyle} className='popup-bg-menu'>
        <div className='popup-div-reviews'>
        <span className="close-rev-mobile" onClick={closeReviews}>&times;</span>
        <h1>{location.state.name}'s Reviews</h1>

        <div className="circle-container">
          <div className="div-circle">
              <img className="img-stars" src={reviews_star} alt="star"/>
              <p className="stars"> {location.state.stars.toFixed(1)} </p>
          </div>
        </div>

        <div className="div-counter-comments">
          <p className="counter"> Based on {location.state.reviews} reviews </p>
        </div>

        <div className='allReviews-container' align="center">
          <div>
            {allReviews}
          </div>
        </div>

        <div className="closeDialog-div" align="center">
          <button onClick={closeReviews} className='btn-closeReviews'>Let's Order</button>
        </div>
        </div>
      </div>}
      {/* </dialog> */}

      <Footer isLogin={false}/>

    </div>
  )
}