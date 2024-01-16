'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { ChangeEvent, useEffect, useState } from 'react'
import { get } from 'http'
import { text } from 'stream/consumers'


export default function Home() {

  const [count, setCount] = useState(0)
  const [color, setColor] = useState('#fff')
  const [textColor, setTextColor] = useState('#141414')

  const changeColors = (evento: ChangeEvent<HTMLInputElement>) => {

    setColor(evento.target.value)

  }

  function getContrastYIQ(hexcolor: string){
    hexcolor = hexcolor.slice(1)

    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#141414' : '#ffffff';
  }

  useEffect(() => {

    // console.log(getContrastYIQ(color.slice(1)), color)
    setTextColor(getContrastYIQ(color))

  }, [color])

  return (
    <>
    
      <h1>Click on the button to count up</h1>
      <h2>{count}</h2>
      <div
        style={{
          width: '300px', 
          height: '300px',
          padding: '1rem',
          backgroundColor: `${color}`
        }}
      >
        <p
          style={{
            color: `${textColor}`
          }}
        >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero laudantium mollitia dicta tempore aspernatur fuga totam sint maxime optio nam qui eligendi, quaerat dolorum reiciendis. Quo possimus itaque atque sint?
        </p>
      </div>
      <input 
        type="color" 
        onChange={changeColors}
      />
    </>

  )
}
