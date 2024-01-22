import { ChangeEvent, FormEvent, WheelEvent, WheelEventHandler, useState } from 'react'
import styles from './NumberInput.module.css'

interface NumberInputProps {

    label: string
    placeholder: string
    valor: string
    setValor: (valor: string) => void

}

const NumberInput = ({ label, placeholder, valor, setValor }: NumberInputProps) => {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    const padrao = /[^0-9|,.]$/
    if (padrao.test(e.target.value)) return

    const valorNumerico = e.target.value
    .replace(/\./g, ',')
    .replace(/\,{2,}/g,',')
    .replace(/^0*([^0]\d*\,\d{1,4}).*/g, "$1")

    console.log(valorNumerico)

    valorNumerico !== ''
      ? setValor(valorNumerico.toLocaleString())
      : setValor('')
    
  }

  return (
    <div className={styles.container}>
        <label className={styles.label}>{label}</label>
        {/* <input 
            className={styles.input}
            // disabled
            type="number" 
            step={0.01}
            placeholder={placeholder}
            value={valor}
            onChange={evento => {
              console.log(evento.target.value);
              evento.target.value !== ''
                ? setValor(parseFloat(evento.target.value))
                : setValor('')
            }}
        
        /> */}
        <input 
            className={styles.input}
            type="text" 
            value={valor}
            inputMode='numeric'
            onChange={handleChange}
            placeholder={placeholder}
        />
    </div>
  )
}

export default NumberInput

