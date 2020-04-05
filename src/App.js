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
      <div style={{ ...cryptoContainerStyle}}>
      {
        cryptos.map(crypto => (
          <div
            key={crypto.id}
            style={{ ...cryptoStyle, backgroundColor: crypto.color }}
          >
            <div style={{ background:`radial-gradient(#fff,${crypto.color})` }}>
              <p style={cryptoTitle}>
                {crypto.title}
              </p>
            </div>
          </div>
        ))
      }
      </div>
    </div>
  )
}

const container = { width:`100%`,minHeight:`100vh`,padding:66,background:`linear-gradient(#fff,#006)`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`, }
const input = { marginBottom:10 }
const button = { marginBottom:10 }
const heading = { fontWeight:`normal`,fontSize:40 }
const cryptoContainerStyle = { display:`flex`,flexFlow:`row wrap` }
const cryptoStyle = { padding:12,margin:8,borderRadius:4,maxWidth:`140px` }
const cryptoTitle = { padding:8,margin:0,fontSize:24 }

export default App
