import { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, WheelEvent, WheelEventHandler, useEffect, useRef, useState } from 'react'
import styles from '../NumberInput/NumberInput.module.css'
import { IFatores } from '@/interfaces/IFatores'
import { init } from 'next/dist/compiled/webpack/webpack'

interface FatoresInput {

    label?: string
    placeholder: string
    index: number
    id: string

    fator: string
    setFator: (fator: (arr: IFatores) => IFatores) => void
}

const FatoresInput = ({ label, placeholder, fator, setFator, index, id }: FatoresInput) => {

  const inputRef = useRef<HTMLInputElement>(null)
  const initialMount = useRef<boolean>(true)

  const [a, setA] = useState(false)
  const [firstMount, setFirstMount] = useState(true)

  const handleChangeValor = (e: ChangeEvent<HTMLInputElement>) => {

    const padrao = /[^0-9|,.]$/
    if (padrao.test(e.target.value)) return

    const valorNumerico = e.target.value
    .replace(/\./g, ',')
    .replace(/\,{2,}/g,',')
    .replace(/^0*([^0]\d*\,\d{1,4}).*/g, "$1")

    console.log(valorNumerico);

    (valorNumerico !== '')
      ? setFator((prev) => {
        const updateFator = {...prev, [id]: valorNumerico}
        return updateFator
      }) 

      : setFator((prev) => {
        const resetFator = {...prev, [id]: ''}
        return resetFator
      })
    
  }


  const handleDisable = (e: MouseEvent<SVGSVGElement, MouseEvent>) => {

    // setDisabled((prev: boolean[]) => {

    //   // Salva uma 'cópia' dos valores anteriores
    //   const updatedDisabled = [...prev] 
    //   console.log(updatedDisabled);
    //   // Acessa os valores no indice no componente e inverte o valor "!prev[index]"
    //   updatedDisabled[index] = !prev[index] 
    //   console.log(updatedDisabled);
    //   return updatedDisabled

    // })
    e
    setA(false)
    setInterval(() => inputRef.current!.focus(), 0)
    
  }

  const handleBlur = () => {

    // setDisabled((prev: boolean[]) => {

    //   // Salva uma 'cópia' dos valores anteriores
    //   const updatedDisabled = [...prev] 
    //   // Acessa os valores no indice no componente e inverte o valor "!prev[index]"
    //   updatedDisabled[index] = true  
    //   return updatedDisabled

    // })
    
    if (fator !== '') {

      setA(true)

    }

  }

  // useEffect(() => {

  //     inputRef.current.blur()

  //     if (!initialMount.current) {
  //       inputRef.current.focus()
  //     }

  // }, [a, initialMount])

  return (
    <div className={styles.container}>
        {label
         ? <label className={styles.label}>{label}</label>
         : <></>
        }
        <input 
            autoFocus={false}
            className={styles.input}
            ref={inputRef}
            disabled={a}
            required={true}
            type="text" 
            value={fator}
            inputMode='numeric'
            onFocus={(e)=>e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
            onChange={handleChangeValor}
            onBlur={handleBlur}
            placeholder={placeholder}
        />
        {/* <svg 
          onClick={handleDisable}
          className={styles.svg}
          // style={{cursor: 'pointer'}}
          width="20px" 
          height="20px" 
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
        <svg 
          className={styles.svg}
          onClick={ e => handleDisable(e)}
          fill="#000000" 
          width="25px" 
          height="25px" 
          viewBox="0 0 32 32" 
          xmlns="http://www.w3.org/2000/svg"
        >
            <path 
              d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z"
            />
        </svg>
    </div>
  )
}

export default FatoresInput

