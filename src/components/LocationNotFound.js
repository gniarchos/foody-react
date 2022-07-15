import React from 'react'
import "./locationNotFound.css"

export default function LocationNotFound(props) {
  return (
    <div className='location-not-found'>
        <img className='sad-emoji-gif' src="https://media.giphy.com/media/IzcFv6WJ4310bDeGjo/giphy.gif" alt="sad emoji"/>

        <h1 className='notFound-title'>Sorry, Foody doesn't deliver to your location.</h1>
        <h2 className='notFound-subtitle'>You can find us in Athens and Thessaloniki.</h2>
    </div>
  )
}
