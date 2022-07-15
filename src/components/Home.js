import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate  } from "react-router-dom"
import { db } from "../services/firebase"
import Navbar from './Navbar'
import LocationNotFound from './LocationNotFound'
import { ClockLoader } from 'react-spinners'
import filter_img from '../images/filter.png'
import filter_img_dark from '../images/filter-dark.png'
import location_img from '../images/location-mini.png'
import Footer from './Footer'
import { nanoid } from "nanoid"
import { Icon } from '@iconify/react'

import "./home.css"

export default function Home() {

  document.title = "Foody | Delivery App "

  const { currentUser, logout } = useAuth()
  const navigate = useNavigate ()
  const [userAge, setUserAge] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [userFname, setUserFname] = React.useState("")
  const [city, setCity] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [stores, setStores] = React.useState([])
  const [orderHistory, setOrderHistory] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [scrolled, setScrolled] = React.useState(false)
  const [showFilters, setShowFilters] =  React.useState(false)
  const [filterCateg, setFilterCateg] = React.useState("All")
  const [greeting, setGreeting] = React.useState("")
  const [greetingGif, setGreetingGif] = React.useState("")
  const [sortBy, setSortBy] = React.useState("")
  const [selectedRadioFilter, setSelectedRadioFilter] = React.useState("all")
  const [selectedRadioOrder, setSelectedRadioOrder] = React.useState("default")
  const [searchItem, setSearchItem] = React.useState("")
  const [darkMode, setDarkMode] = React.useState()
  let sortedStores = stores

  const [themeMethod, setThemeMethod] = React.useState(localStorage.getItem('themeMethod') ? localStorage.getItem('themeMethod') : "Auto")

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

  // function handleThemes() {
  //   // setAllowAutoTheme(oldValue => !oldValue)
  //   const themeText = document.getElementById('themeText')

  //   if (themeText.innerHTML === "Auto")
  //   {
  //       themeText.innerHTML = "Light"
  //       localStorage.setItem('themeMethod', "Light")
  //       setThemeMethod("Light")
  //       this.forceUpdate()

  //   }
  //   else if (themeText.innerHTML === "Light")
  //   {
  //       themeText.innerHTML = "Dark"
  //       localStorage.setItem('themeMethod', "Dark")
  //       setThemeMethod("Dark")
  //       this.forceUpdate();
  //   }
  //   else 
  //   {
  //       themeText.innerHTML = "Auto"
  //       localStorage.setItem('themeMethod', "Auto")
  //       setThemeMethod("Auto")
  //       this.forceUpdate();
  //   }
  // }

  React.useEffect(() => {
    const date = new Date()
    const hour = date.getHours()
    // const hour = 9

    if (hour >= 20 || hour < 5) 
    {
      setGreeting("Good Night ")
      setGreetingGif('https://media.giphy.com/media/fxQp8eDj3n41nC9Lk7/giphy.gif')
    } 
    else if (hour >= 13)
    {
      setGreeting("Good Evening ")
      setGreetingGif("https://media.giphy.com/media/I8EVKUkiCQjkh4NjJS/giphy.gif")
    }
    else
    {
      setGreeting("Good Morning ")
      setGreetingGif("https://media.giphy.com/media/h8OVffxQIVXWM2pwG4/giphy.gif")
    }

    return () => {
      setGreeting({})
      setGreetingGif({})
    }
  }, [])
    
  const pushFilterStyle  = {
    top: scrolled && "0px"

  }

  function handleFilters() {
    // console.log("Filters selected...")
    setShowFilters(true)
  }

  function closePopup() {
    setShowFilters(false)
  }

  function handleSelectedCategory(event) {
    const {value} = event.target
    if ([value] == "all")
    {
      setShowFilters(false)
    }
    setFilterCateg(`${[value]}`)
    setSelectedRadioFilter(`${[value]}`)
  }

  function handleSelectedOrder(event) {

    const {value} = event.target
    setSortBy(value)
    setSelectedRadioOrder(`${[value]}`)
  }

  React.useEffect(() => {
    setIsLoading(true)

    db.collection('stores').onSnapshot(snapshot => {
      setStores(snapshot.docs.map(doc => ({
        id:doc.id,
        name: showFilters ? (JSON.stringify(doc.data().category) === JSON.stringify(filterCateg) && doc.data().name) : doc.data().name,
        category: showFilters ? ( JSON.stringify(doc.data().category) === JSON.stringify(filterCateg) && doc.data().category) : doc.data().category,
        image: showFilters ? ( JSON.stringify(doc.data().category) === JSON.stringify(filterCateg) && doc.data().image) : doc.data().image,
        location: showFilters ? ( JSON.stringify(doc.data().category) === JSON.stringify(filterCateg) && doc.data().location) : doc.data().location,
        reviews: showFilters ? (JSON.stringify(doc.data().category) === JSON.stringify(filterCateg) && doc.data().reviews) : doc.data().reviews,
        min_order: showFilters ? (JSON.stringify(doc.data().category) === JSON.stringify(filterCateg) && doc.data().min_order) : doc.data().min_order,
        stars: showFilters ? (JSON.stringify(doc.data().category) === JSON.stringify(filterCateg) && doc.data().stars) : doc.data().stars
      })))
    })

    db.collection(`order_history-${currentUser.uid}`).orderBy('date_time', "desc").limit(20).onSnapshot(snapshot => {
      setOrderHistory(snapshot.docs.map(doc => ({
        id: doc.id,
        store_name: doc.data().store_name,
        date_time: doc.data().date_time,
        user_id: doc.data().user_id,
        store_id: doc.data().store_id,
        location: doc.data().location,
        category: doc.data().category,
        min_order: doc.data().min_order,
        reviews: doc.data().reviews,
        stars: doc.data().stars
      })))

    })

    db.collection('users').doc(currentUser.uid).get().then(doc => {
      // console.log(doc.data().age)
      setUserAge(doc.data().age)
      setUsername(doc.data().username)
      setCity(doc.data().city)
      setAddress(doc.data().address)
      setUserFname(doc.data().fname)
    })

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => {
      setStores({})
      setOrderHistory({})
      setUserAge({})
      setUsername({})
      setCity({})
      setAddress({})
      setUserFname({})
    }

  }, [filterCateg])

  function goToMenu(name, category, stars, minOrder, reviews, storeId, storeLocation) {
    navigate('/menu', {
      state: {
        store_id: storeId,
        name: name,
        category: category,
        username: username,
        stars: stars,
        minOrder: minOrder,
        userId: currentUser.uid,
        address: address,
        city: storeLocation,
        age: userAge,
        reviews: reviews,
        userLocation: city

      }
    })
  }

  Array.prototype.sortBy = function(p, def) {
    return def !== '1' ? this.slice(0).sort(function(a,b) {
      return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
    }) : 

    this.slice(0).sort(function(a,b) {
      return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    })

  }

  sortBy === "default" && (sortedStores = stores.sortBy('id','1'))

  sortBy === "stars" && (sortedStores = stores.sortBy('stars', '0'))

  sortBy === "reviews" && (sortedStores = stores.sortBy('reviews', '0'))

  sortBy === "min_order" && (sortedStores = stores.sortBy('min_order', '1'))

  const storesInfo = sortedStores.filter(srchStore => {
    if (searchItem === "")
    {
      return srchStore
    }
    else if (srchStore.name.toLowerCase().includes(searchItem.toLocaleLowerCase()))
    {
      return srchStore
    }
  }).map(store => {
    return store.location === JSON.parse(JSON.stringify(city)) && 
    <div key={nanoid()} onClick={() => goToMenu(store.name, store.category, store.stars, store.min_order.toFixed(2), store.reviews, store.id, store.location)} className='store-info'>
      
      <img className="card-img-home" src={store.image} alt="store-img"/>

      <div className='store-name-reviews-container'>
        <p className='store-name'><b>{store.name}</b></p>
        <span className='store-stars-reviews'>{store.stars.toFixed(1)} ({store.reviews})</span>
      </div>

      <p className='store-category'>{store.category}</p>
      
      <hr className='hr-home'/>
      <p className='store-min-order'>Minimum Order: {store.min_order.toFixed(2)} €</p>
    </div> 
  })

  const orderAgain = orderHistory.map(store => {
    return <div onClick={() => goToMenu(store.store_name, store.category, store.stars, store.min_order.toFixed(2), store.reviews, store.storeId, store.location)} key={nanoid()} className='history-info'>
      
      <div className='history-img'>
        {store.category === "Souvlaki" && <Icon icon="noto:burrito" className="history-icon" />}
        {store.category === "Pizza" && <Icon icon="noto:pizza" className="history-icon" />}
        {store.category === "Burger" && <Icon icon="noto:hamburger" className="history-icon" />}
        {store.category === "Noodles" && <Icon icon="noto:steaming-bowl" className="history-icon" />}
        {store.category === "Coffee" && <Icon icon="noto:hot-beverage" className="history-icon" />}
        {store.category === "Cocktails" && <Icon icon="noto:clinking-glasses" className="history-icon" />}
        {store.category === "Brunch" && <Icon icon="noto:cupcake" className="history-icon" />}

        {/* <Icon icon="noto:steaming-bowl" width="50" /> */}

      </div>
      
      <p className='history-store-name'><b>{store.store_name}</b></p>
       
    </div>
  })

  var storesCount = 0
  stores.map(store => {
    store.location === JSON.parse(JSON.stringify(city)) && storesCount++
  })

  //style for loading spinner 
  const override = `
    display: block;
    margin: 0 auto;
  `;

  function handleSearch(event) {
    const {value} = event.target
    setSearchItem(value)
  }

  function historyDivLeft() {
    const historyDiv = document.getElementById("orderHistory-div")
    historyDiv.scrollLeft -= 300
  }

  function historyDivRight() {
    const historyDiv = document.getElementById("orderHistory-div")
    historyDiv.scrollLeft += 300
  }

  return (
    <>
    <Navbar 
      isHome={true}
      isLoggedIn={true} 
      username={username} 
      storesCount={storesCount} 
      city={city}
      address={address}
      loading={isLoading}
      userId= {currentUser.uid}
    />

    <div className='banner-home'>

      <div className='div-top-home'>

        <div className="navbar-found-address">
        {!isLoading ? <h1 className="found-number">Found {storesCount} stores in {city}</h1> : <h1 className="found-number">Searching for stores. . .</h1>}
        
        <div className="home-address">
            <p className="address"><img src={location_img} alt="location-img" /> {address} </p>
        </div>
                   
        </div>

      </div>

    </div>

    <div className='span-filters-mobile-div'>
      <span className='span-filters-mobile' onClick={handleFilters}><img src={filter_img_dark} alt="filters" /> Filters</span>
    </div>
    

    <div className='search-bar-div'>
      
      <input className="search-bar" type="text" onChange={(e) => handleSearch(e)} placeholder='Find a store...'/>
    </div>
    
    <div className='home-page'>

      {/* <button onClick={handleThemes}>TEST THEMES</button> */}

      {isLoading === false && (JSON.parse(JSON.stringify(city)) !== "Athens" && JSON.parse(JSON.stringify(city)) !== "Thessaloniki" && <LocationNotFound />)}

      {isLoading === false
      ? 
      <div className='stores-container'>
        
        {(JSON.parse(JSON.stringify(city)) === "Athens" || JSON.parse(JSON.stringify(city)) === "Thessaloniki") 
        && 
        <div className='home-title-filters'>
          <h2 id="stores-title" className='stores-title'><img className='img-greeting-home' src={greetingGif} alt="night"/>{greeting} {userFname}</h2>
          <span className='span-filters' onClick={handleFilters}><img src={darkMode ? filter_img_dark : filter_img} alt="filters" /> Filters</span>
        </div>}

        {orderAgain.length !== 0 && <div className='wrapper-stores-div-history'>
        <h2 className='section-title'>Order again</h2>
        <p className='leftButton' onClick={historyDivLeft}><Icon icon="dashicons:arrow-left-alt2" className="img-left" /></p>
          <div id="orderHistory-div" className='orderHistory-div'>
            
            {orderAgain}
            
          </div>
          <p className='rightButton' onClick={historyDivRight}><Icon icon="dashicons:arrow-right-alt2"  className="img-right" /></p>
        </div>}

        <div className='wrapper-stores-div'>
        {(JSON.parse(JSON.stringify(city)) === "Athens" || JSON.parse(JSON.stringify(city)) === "Thessaloniki") && <h2 className='section-title'>Stores</h2>}
          <div  className='stores-div'>
            
            {storesInfo.length > 0 ? storesInfo : 
            <div className='search-notFound-div'>
              <img className='notFound-img' src='https://media.giphy.com/media/j4l0mCdcTFRyY4Bc5s/giphy.gif' alt="emoji-gif"/> 
              <h1>Store not found.</h1>
            </div>}
          </div>
        </div>
      </div>
      : 
      <div className='loading-div' align="center"> 
        <ClockLoader color={'#EC2827'} css={override} size={130}/> 
        <h2 style={{color: "#EC2827"}} >Please wait. . . </h2> 
      </div>

      }

      {showFilters 
      && 
      <div style={pushFilterStyle} className='popup-bg-home'>
        <div className='popup-div-home'>
          <span class="close" onClick={closePopup}>&times;</span>

          <div className='popup-title-button'>
            <h1>Filters</h1>
          </div>
          
          <div className='radios-categs'>

            <label class="labl">
              <input type="radio" name="filter-category" checked={selectedRadioFilter === "all" ? true : false} onChange={(e) => handleSelectedCategory(e)} value="all"/>
              <div>Show All</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" checked={selectedRadioFilter === "Souvlaki" ? true : false} onChange={(e) => handleSelectedCategory(e)} value="Souvlaki" />
              <div>Souvlaki</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" checked={selectedRadioFilter === "Pizza" ? true : false} onChange={(e) => handleSelectedCategory(e)} value="Pizza" />
              <div>Pizza</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" checked={selectedRadioFilter === "Cocktails" ? true : false} onChange={(e) => handleSelectedCategory(e)} value="Cocktails" />
              <div>Cocktails</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" checked={selectedRadioFilter === "Brunch" ? true : false} onChange={(e) => handleSelectedCategory(e)} value="Brunch" />
              <div>Brunch</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" checked={selectedRadioFilter === "Burger" ? true : false} onChange={(e) => handleSelectedCategory(e)} value="Burger" />
              <div>Burger</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" checked={selectedRadioFilter === "Coffee" ? true : false} onChange={(e) => handleSelectedCategory(e)} value="Coffee" />
              <div>Coffee</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" checked={selectedRadioFilter === "Noodles" ? true : false} onChange={(e) => handleSelectedCategory(e)} value="Noodles" />
              <div>Noodles</div>
            </label>

          </div>
      
          <div className='sortby-div'>
            <h1>Sort by</h1>
          </div>

          <div className='radios-categs'>

            <label class="labl">
              <input type="radio" name="filter-sortby" checked={selectedRadioOrder === "default" ? true : false} onChange={(e) => handleSelectedOrder(e)} value="default"/>
              <div>Default</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-sortby" checked={selectedRadioOrder === "stars" ? true : false} onChange={(e) => handleSelectedOrder(e)} value="stars" />
              <div>Stars</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-sortby" checked={selectedRadioOrder === "reviews" ? true : false} onChange={(e) => handleSelectedOrder(e)} value="reviews" />
              <div>Reviews</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-sortby" checked={selectedRadioOrder === "min_order" ? true : false} onChange={(e) => handleSelectedOrder(e)} value="min_order" />
              <div>Min. Order</div>
            </label>

            </div>
          
        </div>
      </div>}

    </div>

    {isLoading === false && <Footer isLogin={false}/>}

    </>
  )
}