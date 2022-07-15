import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import pendingRev_img from '../images/pending-rev.jpg'
import { Icon } from '@iconify/react'
import { db } from "../services/firebase"
import { nanoid } from "nanoid"
import star_unfilled from "../images/star-unfilled.png"
import star_filled from "../images/star-filled.png"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { SyncLoader } from 'react-spinners'
import "./pendingReviews.css"


export default function PendingReviews() {

    document.title = `Foody | Review Your Orders `
    
    const navigate = useNavigate ()
    const location = useLocation()
    const [pendingReviews, setPendingReviews] = React.useState([])
    const [userComment, setUserComment] = React.useState("")
    const [darkMode, setDarkMode] = React.useState()
    const [isLoading, setIsLoading] = React.useState(true)
  
//     React.useEffect(() => {
  
//       const date = new Date();
//       const hour = date.getHours()
//     //   const hour = 18
      
//       if (hour <= 5 || hour >= 20) 
//       {
//           localStorage.setItem('darkMode', 'enabled')
//           document.body.classList.add('dark')
//           setDarkMode(true)
//       } 
//       else
//       {
//           localStorage.setItem('darkMode', null)
//           document.body.classList.add('light')
//           setDarkMode(false)
//       }
  
  
//   }, [])

    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    React.useEffect(() => {

        setIsLoading(true)
  
        db.collection("pending-reviews").orderBy('date_time', 'desc').onSnapshot(snapshot => {
            setPendingReviews(snapshot.docs.map(doc => ({
            id: doc.id,
            store_name: doc.data().store_name,
            // date_time: doc.data().date_time,
            date_time: `${doc.data().date_time.toDate().toDateString()} - ${doc.data().date_time.toDate().toLocaleTimeString()}`,
            user_id: doc.data().user_id,
            store_id: doc.data().store_id
          })))

        })

        setTimeout(() => {
            setIsLoading(false)
          }, 1000)
        
      }, [])

    //   console.log(pendingReviews.length)

    const sideImageByCateg = {
        backgroundImage: `url(${pendingRev_img})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
    }

    function goBackHome() {
        navigate('/')
    }

    const [showReviewFrom, setShowReviewFrom] = React.useState(false)
    const [popupStore, setPopupStore] = React.useState("")
    const [popupStoreId, setPopupStoreId] = React.useState("")
    const [popupUserId, setPopupUserId] = React.useState("")
    const [popupReviewId, setPopupReviewId] = React.useState("")
    const [popupOrderTimeDate, setPopupOrderTimeDate] = React.useState("")
    const [starsSelected, setStarsSelected] = React.useState(false)
    const [starsRatingNum, setStarsRatingNum] = React.useState(0)

    function openReviewForm(storeName, storeId, timeDate, userId, reviewId) {
        setShowReviewFrom(true)
        setPopupStore(storeName)
        setPopupStoreId(storeId)
        setPopupOrderTimeDate(timeDate)
        setPopupUserId(userId)
        setPopupReviewId(reviewId)


    }

    function closeReviewForm() {
        setShowReviewFrom(false)
        setStarsSelected(false)
        setStarsRatingNum(0)

    }

    function hoverStar(event) {
        // console.log("Hovered a star")
        const {id} = event.target
        // console.log(`With id: ${id}`)
        // event.currentTarget.src = star_filled
        // document.querySelector("#star-1").setAttribute('src', star_filled)

        if(id == "star-2") 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            document.querySelector("#star-2").setAttribute('src', star_filled)

        }
        else if(id == "star-3") 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            document.querySelector("#star-2").setAttribute('src', star_filled)
            document.querySelector("#star-3").setAttribute('src', star_filled)
        }
        else if(id == "star-4") 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            document.querySelector("#star-2").setAttribute('src', star_filled)
            document.querySelector("#star-3").setAttribute('src', star_filled)
            document.querySelector("#star-4").setAttribute('src', star_filled)
        }
        else if(id == "star-5") 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            document.querySelector("#star-2").setAttribute('src', star_filled)
            document.querySelector("#star-3").setAttribute('src', star_filled)
            document.querySelector("#star-4").setAttribute('src', star_filled)
            document.querySelector("#star-5").setAttribute('src', star_filled)
        }
        else 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
        }

    }

    function unHoverStar(event) {
        // console.log("Hovered a star")
        const {id} = event.target
        // console.log(`With id: ${id}`)
        // event.currentTarget.src = star_filled
        // document.querySelector("#star-1").setAttribute('src', star_filled)

        document.querySelector("#star-1").setAttribute('src', star_unfilled)
        document.querySelector("#star-2").setAttribute('src', star_unfilled)
        document.querySelector("#star-3").setAttribute('src', star_unfilled)
        document.querySelector("#star-4").setAttribute('src', star_unfilled)
        document.querySelector("#star-5").setAttribute('src', star_unfilled)

    }

    function ConfirmStars(event) {
        // console.log("Set stars")
        const {id} = event.target
        // console.log(`With id: ${id}`)
        // event.currentTarget.src = star_filled
        // document.querySelector("#star-1").setAttribute('src', star_filled)

        

        if(id == "star-2") 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            document.querySelector("#star-2").setAttribute('src', star_filled)

             setStarsSelected(true)
             setStarsRatingNum(2)
        }
        else if(id == "star-3") 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            document.querySelector("#star-2").setAttribute('src', star_filled)
            document.querySelector("#star-3").setAttribute('src', star_filled)
            setStarsSelected(true)
            setStarsRatingNum(3)
        }
        else if(id == "star-4") 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            document.querySelector("#star-2").setAttribute('src', star_filled)
            document.querySelector("#star-3").setAttribute('src', star_filled)
            document.querySelector("#star-4").setAttribute('src', star_filled)
            setStarsSelected(true)
            setStarsRatingNum(4)
        }
        else if(id == "star-5") 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            document.querySelector("#star-2").setAttribute('src', star_filled)
            document.querySelector("#star-3").setAttribute('src', star_filled)
            document.querySelector("#star-4").setAttribute('src', star_filled)
            document.querySelector("#star-5").setAttribute('src', star_filled)
            setStarsSelected(true)
            setStarsRatingNum(5)
        }
        else 
        {
            document.querySelector("#star-1").setAttribute('src', star_filled)
            setStarsSelected(true)
            setStarsRatingNum(6)
        }

        

    }

    function handleComments(event) {
        const {value} = event.target

        setUserComment(value)
    }

    
    async function submitRating(storeName, dateTime, reviewId) {


        const docRef = await addDoc(collection(db, "reviews"), {
            stars: JSON.parse(starsRatingNum),
            store: JSON.parse(JSON.stringify(storeName)),
            comment: JSON.parse(JSON.stringify(userComment)),
            timeDate: serverTimestamp(),
            user:JSON.parse(JSON.stringify(location.state.username))
        })

        var reviewsFound = 0
        var reviewsStars = 0
        var avg = 0
        var allStars = [];

        db.collection("reviews").where("store", "==", storeName).onSnapshot(snapshot => {
            // console.log(snapshot.size)
            reviewsFound = snapshot.size
            snapshot.docs.map(doc => {
                allStars.push(doc.data().stars)
            })
                for (let i=0; i < allStars.length; i++)
                {
                    reviewsStars += allStars[i]
                }
                // console.log(allStars)
                // console.log(reviewsStars)
                // console.log(reviewsFound)

                avg = reviewsStars / reviewsFound

                db.collection("stores").doc(popupStoreId).update({
                    reviews: reviewsFound,
                    stars: avg
                  })

                
                    
        })


        await db.collection("pending-reviews").doc(reviewId).delete()


        closeReviewForm()

    }

    // console.log(location.state.userId)


    const allPendingReviews = pendingReviews.map(pend => {
        return pend.user_id === location.state.userId && (
        <div key={nanoid()} onClick={() => openReviewForm(pend.store_name, pend.store_id, pend.date_time, pend.user_id, pend.id)} className='div-storeReview'>
    
            <div className='pendingStoreTitle-div'>
                <Icon icon="bi:bag-heart" width="30" style={{marginBottom:"8px", marginRight: "5px"}} /><h1>{pend.store_name}</h1>
            </div>
            <p>{pend.date_time}</p>
          
        </div>)
    })

    
    // console.log(allPendingReviews.every( (val, i, arr) => val === arr[0] ))

    return (
        <div className='pending-layout'>
            <Navbar 
                isLoggedIn={true} 
                username={location.state.username}
                isHome={false}
                isPending={true}
            />

            <div>

                <div className='pending-container'>

                    <div className='pending-title'>
                        <div onClick={goBackHome} className='backIcon-div'>
                            <Icon icon="codicon:arrow-small-left" width="40px"/>
                            <h4>Back Home</h4>
                        </div>
                        
                        <h1 className='pending-reviews'>PENDING REVIEWS</h1>
                    </div>

                    <div className='review-info-container'>
                        <div style={sideImageByCateg} className='pending-photo'>

                        </div>

                        {isLoading ? <div className='pending-wrapper noData'> 
                            <SyncLoader color={'#ffce30'} size={20}/> 
                        </div> 
                        : 
                        (allPendingReviews.every( (val, i, arr) => val === arr[0] ) ? 
                        <div className='pending-wrapper noData'>
                            <p class='no-pendingReviews'> You don't have any pending reviews.</p>
                            <p class='no-pendingReviews'> Make orders and check back later.</p>
                        </div> 
                        : 
                        <div id="pending" className='pending-wrapper'>
                            {allPendingReviews}
                        </div>)}
                        
                    </div>
                </div>

            {showReviewFrom && 
            <div className='popup-bg'>
                <div className='popup-div'>
                    <span className="close" onClick={closeReviewForm}>&times;</span>
                    <h1 className='rateTitle'>Rate your order from {popupStore} </h1>

                    <div className='stars-div'>
                        {/* <h3 id="stars-selected" className="stars-selected">Your rating is</h3> */}
                        {/* <input name="num-stars" value={starsRatingNum} /> */}
                        
                        <div>
                        <img id="star-1" src={star_unfilled} onMouseOver={!starsSelected ? (e) => hoverStar(e) : null} onMouseOut={!starsSelected ? (e) => unHoverStar(e) : null} onClick={!starsSelected ? (e) => ConfirmStars(e) : null}/>
                        <img id="star-2" src={star_unfilled} onMouseOver={!starsSelected ? (e) => hoverStar(e) : null} onMouseOut={!starsSelected ? (e) => unHoverStar(e) : null} onClick={!starsSelected ? (e) => ConfirmStars(e) : null}/>
                        <img id="star-3" src={star_unfilled} onMouseOver={!starsSelected ? (e) => hoverStar(e) : null} onMouseOut={!starsSelected ? (e) => unHoverStar(e) : null} onClick={!starsSelected ? (e) => ConfirmStars(e) : null}/>
                        <img id="star-4" src={star_unfilled} onMouseOver={!starsSelected ? (e) => hoverStar(e) : null} onMouseOut={!starsSelected ? (e) => unHoverStar(e) : null} onClick={!starsSelected ? (e) => ConfirmStars(e) : null}/>
                        <img id="star-5" src={star_unfilled} onMouseOver={!starsSelected ? (e) => hoverStar(e) : null} onMouseOut={!starsSelected ? (e) => unHoverStar(e) : null} onClick={!starsSelected ? (e) => ConfirmStars(e) : null}/>
                        </div>
                        <textarea className="textarea-review" id="comments" name="comments" rows="8" cols="50" onChange={(e) => handleComments(e)} placeholder="Was your order as expected?"></textarea>
                        </div>

                    
                <div className='button-div-rating' align="center">
                    <button onClick={() => submitRating(popupStore, popupOrderTimeDate, popupReviewId )} className='btn-closeRatings'>Submit</button>
                </div>
                
                </div>
            </div>}
        </div>

            <Footer isLogin={false}/>
            
        </div>
    )
}
