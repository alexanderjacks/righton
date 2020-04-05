import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import { Input, Button } from 'antd'
import { DataStore } from '@aws-amplify/datastore'
import { Message } from './models'

const initialState = { color: '#880000', title: '', }

function App() {
  const [formState, updateFormState] = useState(initialState)
  const [cryptos, updateCryptos] = useState([])
  const [showPicker, updateShowPicker] = useState(false)

  function onChange(e) {
    if (e.hex) {
      updateFormState({ ...formState, color: e.hex })
    } else {
      updateFormState({ ...formState, title: e.target.value })
    }
  }

  async function fetchCryptos() {
    const cryptos = await DataStore.query(Crypto)
    updateCryptos(cryptos)
  }
  async function createCrypto() {
    if (!formState.title) return
    await DataStore.save(new Crypto({ ...formState }))
    updateFormState(initialState)
  }
}
