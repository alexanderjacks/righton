import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import { Input, Button } from 'antd'
import { DataStore } from '@aws-amplify/datastore'
import { Crypto } from './models'

const initialState = { color: '#880000', title: '', }

function App() {
  const [formState, updateFormState] = useState(initialState)
  const [cryptos, updateCryptos] = useState([])
  const [showPicker, updateShowPicker] = useState(false)

  useEffect(() => {
    fetchCryptos()
    const subscription = DataStore.observe(Crypto).subscribe(() => fetchCryptos())
    return () => subscription.unsubscribe()
  })

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

  return (
    <div style={container}>
      <h1 style={heading}>Live Crypto Board</h1>
      <Input
        onChange={onChange}
        name='title'
        placeHolder='crypto title'
        value={formState.title}
        style={input}
      />
      <div>
        <Button
          onClick={() => updateShowPicker(!showPicker)}
          style={button}
        >
          ON/OFF Colorbox
        </Button>
        <p>
          Color:
          <span
            style={{fontWeight:'bold', color:formState.color}}
          >
            {formState.color}
          </span>
        </p>
      </div>
      {
        showPicker && <SketchPicker color={formState.color} onChange={onChange}/>
      }
      <Button
        onClick={createCrypto}
        type='primary'
      >
        Create Crypto
      </Button>
      {
        cryptos.map(crypto => (
          <div
            key={crypto.id}
            style={{ ...cryptoStyle, backgroundColor: crypto.color }}
          >
            <div style={cryptoBg}>
              <p style={cryptoTitle}>
                {crypto.title}
              </p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

const container = { width:`100%`,padding:40,maxWidth:900 }
const input = { marginBottom:10 }
const button = { marginBottom:10 }
const heading = { fontWeight:`normal`,fontSize:40 }
const cryptoBg = { backgroundColor:`papayawhip` }
const cryptoTitle = { padding:8,margin:0,fontSize:24 }
const cryptoStyle = { padding:20,marginTop:8,borderRadius:4 }

export default App
