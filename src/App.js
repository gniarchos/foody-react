import React from 'react'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Home from './components/Home'
import Menu from './components/Menu'
import PendingReviews from './components/PendingReviews'
import Featured from './components/Featured'
import OrderSummary from './components/OrderSummary'
import ForgotPassword from './components/ForgotPassword'
import { db, auth } from "./services/firebase";
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute"
import UploadData from './components/UploadData'
import UploadDataMenu from './components/UploadDataMenu'
import UploadReviews from './components/UploadReviews'
import YourAccount from './components/YourAccount'

export default function App() {

  const [featured, setFeatured] = React.useState([])

  const featuredInfo = featured.map(store => {
    return <Featured key={store.id} data={store}/>
  })

  React.useEffect(() => {
    db.collection('featured_stores').onSnapshot(snapshot => {
      setFeatured(snapshot.docs.map(doc => ({
        id:doc.id,
        name:doc.data().name,
        category:doc.data().category,
        image:doc.data().image,
        status:doc.data().status,
        stars:doc.data().stars,
        reviews:doc.data().reviews,
      })))
    })
  }, [])


  return (
    
      <main>
        <Router>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<PrivateRoute />}>
                <Route exact path='/' element={<Home/>}/>
              </Route>

              {/* FOR BUILDING THE DATABASE ONLY - SHOULD BE REMOVED */}
              <Route exact path="/upload-data-firebase-stores" element={<PrivateRoute />}>
                <Route exact path='/upload-data-firebase-stores' element={<UploadData/>}/>
              </Route>

              {/* FOR BUILDING THE DATABASE ONLY - SHOULD BE REMOVED */}
              <Route exact path="/upload-data-firebase-menu" element={<PrivateRoute />}>
                <Route exact path='/upload-data-firebase-menu' element={<UploadDataMenu />}/>
              </Route>

              {/* FOR BUILDING THE DATABASE ONLY - SHOULD BE REMOVED */}
              <Route exact path="/upload-data-firebase-reviews" element={<PrivateRoute />}>
                <Route exact path='/upload-data-firebase-reviews' element={<UploadReviews />}/>
              </Route>

              <Route exact path="/your-account" element={<PrivateRoute />}>
                <Route exact path='/your-account' element={<YourAccount  />}/>
              </Route>

              <Route exact path="/menu" element={<PrivateRoute />}>
                <Route exact path='/menu' element={<Menu/>}/>
              </Route>

              <Route exact path="/order-summary" element={<PrivateRoute />}>
                <Route exact path='/order-summary' element={<OrderSummary />}/>
              </Route>

              <Route exact path="/pending-reviews" element={<PrivateRoute />}>
                <Route exact path='/pending-reviews' element={<PendingReviews />}/>
              </Route>
              
              <Route path="/signup" element={<SignUp featuredInfo={featuredInfo}/>} />
              <Route path="/index" element={<Login featuredInfo={featuredInfo}/>} />
              <Route path="/forgot-password" element={<ForgotPassword featuredInfo={featuredInfo}/>} />
            </Routes>
          </AuthProvider>
        </Router>
      </main>
  )
}
