import React, { Component } from 'react'
import Async from 'react-async'
//
// after:
// https://scotch.io/tutorials/react-async-for-declarative-data-fetching
// grab live data, format as JSON
const loadJson = () =>
  fetch('https://api.coinmarketcap.com/v1/ticker/?limit=1')
  .then(response => (response.ok ? response : Promise.reject(response)))
  .then(response => response.json())

//   axios.get("https://api.nomics.com/v1/prices?key=643698f1108812b938fe8a2d81983059&interval=1d,30d&quote-currency=USD", {

const Nomics = () => (
  <Async promiseFn={loadJson}>
    {({ data, error, isLoading }) => {
      if (isLoading) return `Loading plz w8 . . .`
      if (error) return `That's a negative, Ghostrider . . . In fact, machine sez: ${error.message}. Try again later!`
      if (data)
        return (
          <ul>
            {data.map(item => (
              <li>
                {item.name}: {item.price_usd}
              </li>
            ))}
          </ul>
        )
      return null // justincase
    }}
  </Async>
)
export default Nomics
