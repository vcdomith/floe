import { ChangeEvent, FormEvent, ReactNode, WheelEvent, WheelEventHandler, useState } from 'react'
import styles from './NumberInput.module.scss'
import { IFatores } from '@/interfaces/IFatores'

interface NumberInputProps {

    label?: string
    placeholder: string
    valor: string
    setValor: (valor: string) => void
    // Partial type -> ler mais sobre
    [key: string]: any

}

const NumberInput = ({ label, placeholder, valor, setValor, onBlur, ...props }: NumberInputProps) => {

  // const [disabled, setDisabled] = useState(true)

  const handleChangeValor = (e: ChangeEvent<HTMLInputElement>) => {

    const padrao = /[^0-9|,.]$/
    if (padrao.test(e.target.value)) return

    const valorNumerico = e.target.value
    .replace(/\./g, ',')
    .replace(/\,{2,}/g,',')
    .replace(/^0*([^0]\d*\,\d{1,4}).*/g, "$1");

    // console.log(valorNumerico.toLocaleString());

    (valorNumerico !== '')
      ? setValor(valorNumerico.toLocaleString()) 
      : setValor('')
    
  }


  // const handleClick = () => {

  //   setDisabled(disabled ? false : true)

  // }

  return (
    <div className={styles.container}>
        {label
         ? <label className={styles.label}>{label}</label>
         : <></>
        }
        <input 
            // className={styles.input}
            // disabled={disabled}
            className={styles.inputFont}
            required
            type="text" 
            value={valor}
            inputMode='numeric'
            onChange={handleChangeValor}
            onBlur={onBlur}
            // onBlur={() => setDisabled(true)}
            placeholder={placeholder}
            {...props}
        />
        {/* <svg 
          onClick={handleClick}
          width="25px" 
          height="25px" 
          viewBox="0 -0.5 21 21" 
          version="1.1" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Dribbble-Light-Preview" transform="translate(-379.000000, -359.000000)" fill="#591c4a">
                <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path d="M323,219 L343.660141,219 L343.660141,217.042095 L323,217.042095 L323,219 Z M330.231049,212.147332 L330.231049,209.51395 L339.088052,201.64513 L340.979487,203.643172 L332.880712,212.147332 L330.231049,212.147332 Z M344,203.64513 L339.144867,199 L328.165035,208.687714 L328.165035,214.105237 L333.764966,214.105237 L344,203.64513 Z" id="edit-[#1482]">
                    </path>
                </g>
            </g>
          </g>
        </svg> */}
    </div>
  )
}

export default NumberInput

