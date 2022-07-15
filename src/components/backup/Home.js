import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate  } from "react-router-dom"
import { db } from "../services/firebase"
import Navbar from './Navbar'
import LocationNotFound from './LocationNotFound'
import { ClockLoader } from 'react-spinners'
import filter_img from '../images/filter.png'

export default function Home() {

    document.title = "Foody | Delivery App "

    const { currentUser, logout } = useAuth()
    const [error, setError] = React.useState("")
    const navigate = useNavigate ()
    const [userAge, setUserAge] = React.useState("")
    const [username, setUsername] = React.useState("")
    const [city, setCity] = React.useState("")
    const [address, setAddress] = React.useState("")
    const [stores, setStores] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [scrolled, setScrolled] = React.useState(false)
    const [filter, setFilter] = React.useState(false)
    const [showFilters, setShowFilters] =  React.useState(false)
    const [filterCateg, setFilterCateg] = React.useState("All")
    const [greeting, setGreeting] = React.useState("")
    const [greetingGif, setGreetingGif] = React.useState("")

    React.useEffect(() => {
      const date = new Date()
      // const hour = date.getHours()
      // const hour = 9
  
      if (hour >= 20 || hour < 5) 
      {
        setGreeting("Good Night ")
        setGreetingGif("https://media.giphy.com/media/w60YGwxUUYr69zbsIg/giphy.gif")
      } 
      else if (hour >= 13)
      {
        setGreeting("Good Evening ")
        setGreetingGif("https://media.giphy.com/media/I8EVKUkiCQjkh4NjJS/giphy.gif")
        // https://media.giphy.com/media/I8EVKUkiCQjkh4NjJS/giphy.gif
        // https://media.giphy.com/media/L2wEbAL75L24xiHWFa/giphy.gif
      }
      else
      {
        setGreeting("Good Morning ")
        setGreetingGif("https://media.giphy.com/media/h8OVffxQIVXWM2pwG4/giphy.gif")
      }
    }, [])
    

    const contentPush = () => {
      if (window !== undefined) {
      let windowHeight = window.scrollY;
      windowHeight > 15 && setScrolled(true)
      windowHeight === 0 && setScrolled(false)
      }
    }

    const pushContentStyle = {
      marginTop: scrolled && "150px",
      // transition: scrolled && "all 0.4s ease-in-out"

    } 

    const pushFilterStyle  = {
      top: scrolled && "0px"

    }

    function handleFilters() {
      // console.log("Filters selected...")
      setShowFilters(true)

    }

    function closeFilters() {
      setShowFilters(false)
    }

    function handleSelectedCategory(event) {
      const {value} = event.target
      // console.log(JSON.stringify([value]))
      if ([value] == "all")
      {
        setShowFilters(false)
      }
      setFilterCateg(`${[value]}`)
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

      db.collection('users').doc(currentUser.uid).get().then(doc => {
        // console.log(doc.data().age)
        setUserAge(doc.data().age)
        setUsername(doc.data().username)
        setCity(doc.data().city)
        setAddress(doc.data().address)
      })

      setTimeout(() => {
        setIsLoading(false)
      }, 2300)

      // setIsLoading(false)

    }, [filterCateg])

    function goToMenu(name, category, stars, minOrder) {
      navigate('/menu', {
        state: {
          name: name,
          category: category,
          username: username,
          stars: stars,
          minOrder: minOrder

        }
      })
    }


    const storesInfo = stores.map(store => {
     return store.location === JSON.parse(JSON.stringify(city)) && 
     <div onClick={() => goToMenu(store.name, store.category, store.stars, store.min_order.toFixed(2))} className='store-info'>
       
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



    var storesCount = 0
    stores.map(store => {
      store.location === JSON.parse(JSON.stringify(city)) && storesCount++
     })

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

    React.useEffect(() => {
      window.addEventListener('scroll', contentPush);
  }, [])

  //style for loading spinner 
  const override = `
    display: block;
    margin: 0 auto;
  `;

  return (
    <>
    <Navbar 
      isHome={true}
      isLoggedIn={true} 
      username={username} 
      handleLogout={handleLogout} 
      storesCount={storesCount} 
      city={city}
      address={address}
      loading={isLoading}
    />

    <div className='banner-home'>

    </div>
    
    <div className='home-page'>

      <div className='div-top-home'>
  
      </div>

      {isLoading === false && (JSON.parse(JSON.stringify(city)) !== "Athens" && JSON.parse(JSON.stringify(city)) !== "Thessaloniki" && <LocationNotFound />)}

      {isLoading === false 
      ? 
      <div style={pushContentStyle}>
        
        {(JSON.parse(JSON.stringify(city)) === "Athens" || JSON.parse(JSON.stringify(city)) === "Thessaloniki") 
        && 
        <div style={pushContentStyle} className='home-title-filters'>
          <h1 id="stores-title" className='stores-title'><img className='img-greeting-home' src={greetingGif} alt="night"/>{greeting}, Giannis</h1>
          <span className='span-filters' onClick={handleFilters}><img src={filter_img} alt="filters" /> Filters</span>
        </div>}

        {/* https://media.giphy.com/media/JzLu8WPwZZRa2iTFcJ/giphy.gif */}
        {/* https://media.giphy.com/media/w60YGwxUUYr69zbsIg/giphy.gif */}
        <div  className='stores-div'>
          
          {storesInfo}
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
      <div style={pushFilterStyle} className='filters-bg'>
        <div className='filters-div'>
          <span class="close" onClick={closeFilters}>&times;</span>
          {/* <img className='button-close' onClick={closeFilters} src={close_img} alt="close-button"/> */}

          <div className='filters-title-button'>
            {/* <img className='button-close' onClick={closeFilters} src={close_img} alt="close-button"/> */}
            <h1>Filters</h1>
          </div>
          
          <div className='radios-categs'>

            <label class="labl">
              <input type="radio" name="filter-category" onChange={(e) => handleSelectedCategory(e)} value="all"/>
              <div>Show All</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" onChange={(e) => handleSelectedCategory(e)} value="Souvlaki" />
              <div>Souvlaki</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" onChange={(e) => handleSelectedCategory(e)} value="Pizza" />
              <div>Pizza</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" onChange={(e) => handleSelectedCategory(e)} value="Cocktails" />
              <div>Cocktails</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" onChange={(e) => handleSelectedCategory(e)} value="American Burger" />
              <div>American Burger</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" onChange={(e) => handleSelectedCategory(e)} value="Burger" />
              <div>Burger</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" onChange={(e) => handleSelectedCategory(e)} value="Coffee" />
              <div>Coffee</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-category" onChange={(e) => handleSelectedCategory(e)} value="Noodles" />
              <div>Noodles</div>
            </label>

          </div>
      
          <div className='sortby-div'>
            <h1>Sort by</h1>
          </div>

          <div className='radios-categs'>

            <label class="labl">
              <input type="radio" name="filter-sortby" value="all"/>
              <div>Default</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-sortby" value="Souvlaki" />
              <div>Stars</div>
            </label>

            <label class="labl">
              <input type="radio" name="filter-sortby" value="Pizza" />
              <div>Min. Order</div>
            </label>

            </div>
          
        </div>
      </div>}

    </div>

    </>
  )
}
