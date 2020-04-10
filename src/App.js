import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import { Input, Button } from 'antd'
import { DataStore } from '@aws-amplify/datastore'
import { Crypto } from './models'
import './App.css' // for GoogleFonts

const initialState = { color1: '#00bfff', color2: '#ff1493', title: '' }

function App() {
  const [formState, updateFormState] = useState(initialState)
  const [cryptos, updateCryptos] = useState([])
  const [showPicker, updateShowPicker] = useState(true) // reuse logic for checkbox that controls radial=True v0.2

  useEffect(() => {
    fetchCryptos()
    const subscription = DataStore.observe(Crypto).subscribe(() => fetchCryptos())
    return () => subscription.unsubscribe()
  })

  function onChange1(e) {
    updateFormState({ ...formState, color1: e.hex })
  }

  function onChange2(e) {
    updateFormState({ ...formState, color2: e.hex })
  }

  function onChangeT(e) {
    updateFormState({ ...formState, title: e.target.value })
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
      <div>
        <h1 style={heading}>Color Gradient Maker</h1>
        <h3 style={heading}>by <a href='https://j4cks.com'>Jacks Consulting</a></h3>
      </div>
      <div style={smallContainerStyle}>
        {/*
        // want a Input checkbox Instead
        // will control Boolean that makes into radial gradient (v0.2)
        <Button
          onClick={() => updateShowPicker(!showPicker)}
          style={button}
        >
          ON/OFF Colorbox
        </Button>
        */}

        <div>
          Color #1:&nbsp;
          <span style={{fontWeight:'bold', color:formState.color1}}>
            {formState.color1}
          </span>
        </div>
        <div>
          Color #2:&nbsp;
          <span style={{fontWeight:'bold', color:formState.color2}}>
            {formState.color2}
          </span>
        </div>


      </div>
      {
        showPicker &&
        <div style={{ ...smallContainerStyle}}>
          <SketchPicker id='sp1' color={formState.color1} onChange={onChange1}/>
          <SketchPicker id='sp2' color={formState.color2} onChange={onChange2}/>
        </div>
      }
      <Input
        onChange={onChangeT}
        name='title'
        placeHolder='name this gradient'
        value={formState.title}
        style={input}
      />
      <Button
        onClick={createCrypto}
        type='primary'
      >
        Save Gradient
      </Button>
      <div style={{ ...smallContainerStyle}}>
      {
        cryptos.map(crypto => (
          <div
            key={crypto.id}
            style={{ ...cryptoStyle, backgroundColor: crypto.color }}
          >
            <div style={{ background:`radial-gradient(${crypto.color1},${crypto.color2})` }}>
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

const container = { width:`100%`,minHeight:`100vh`,padding:66,background:`linear-gradient(#888,#eee,#888)`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`,fontFamily:`Lato, sans-serif` }
const input = { marginBottom:10 }
const button = { marginBottom:10 }
const heading = { fontWeight:`normal`,fontFamily:`Josefin Sans, sans-serif` }
const smallContainerStyle = { display:`flex`,flexFlow:`row wrap`,justifyContent:`space-around`,alignItems:`center` }
const cryptoStyle = { padding:12,margin:8,borderRadius:4,maxWidth:`140px` }
const cryptoTitle = { padding:8,margin:0,fontSize:24 }
export default App
