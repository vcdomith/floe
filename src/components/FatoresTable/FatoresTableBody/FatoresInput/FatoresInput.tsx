import { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, RefObject, WheelEvent, WheelEventHandler, useEffect, useRef, useState } from 'react'
import styles from '../NumberInput/NumberInput.module.css'
import { IFatores } from '@/interfaces/IFatores'

interface FatoresInput {

    label?: string
    placeholder: string
    index: number
    id: string

    formRef: RefObject<HTMLFormElement>

    fator: string
    setFator: (fator: (arr: IFatores) => IFatores) => void
}

const FatoresInput = ({ label, placeholder, fator, setFator, index, id, formRef }: FatoresInput) => {

  const inputRef = useRef<HTMLInputElement>(null)

  const [disabled, setDisabled] = useState(false)
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


  const handleDisable = () => {

    // setDisabled((prev: boolean[]) => {

    //   // Salva uma 'cópia' dos valores anteriores
    //   const updatedDisabled = [...prev] 
    //   console.log(updatedDisabled);
    //   // Acessa os valores no indice no componente e inverte o valor "!prev[index]"
    //   updatedDisabled[index] = !prev[index] 
    //   console.log(updatedDisabled);
    //   return updatedDisabled

    // })
    setDisabled(false)
    if (!disabled) inputRef.current!.focus()
    
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

      setDisabled(true)

    }

  }

  useEffect(() => {

    if (!firstMount) {
      inputRef.current!.focus();
    }
    setFirstMount(false);
  }, [disabled]);

  return (
    <div className={styles.container}>
        {label
         ? <label className={styles.label}>{label}</label>
         : <></>
        }
        <input 
            // autoFocus={false}
            // className={styles.input}
            ref={inputRef}
            disabled={disabled}
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
        {/* <svg 
          className={styles.svg}
          onClick={handleDisable}
          fill="#000000" 
          width="25px" 
          height="25px" 
          viewBox="0 0 32 32" 
          xmlns="http://www.w3.org/2000/svg"
        >
            <path 
              d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z"
            />
        </svg> */}
        {/* <svg 
          onClick={handleDisable}
          width="25px" 
          height="25px" 
          viewBox="0 0 1024 1024" 
          version="1.1" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
          d="M396.8 543.808V627.2h83.392l371.2-371.2L768 172.608l-371.2 371.2zM320 512l448-448 192 192-448 448H320V512z m499.2 371.2V512H896v448H64V128h448v76.8H140.8v678.4h678.4z" 
          fill="#000000" 
          />
        </svg> */}
        <svg 
          onClick={handleDisable}
          width="25px" 
          height="25px" 
          viewBox="-2 -2 28 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M18 9.99982L14 5.99982M2.5 21.4998L5.88437 21.1238C6.29786 21.0778 6.5046 21.0549 6.69785 20.9923C6.86929 20.9368 7.03245 20.8584 7.18289 20.7592C7.35245 20.6474 7.49955 20.5003 7.79373 20.2061L21 6.99982C22.1046 5.89525 22.1046 4.10438 21 2.99981C19.8955 1.89525 18.1046 1.89524 17 2.99981L3.79373 16.2061C3.49955 16.5003 3.35246 16.6474 3.24064 16.8169C3.14143 16.9674 3.06301 17.1305 3.00751 17.302C2.94496 17.4952 2.92198 17.702 2.87604 18.1155L2.5 21.4998Z" 
            stroke="#000000" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
    </div>
  )
}

export default FatoresInput

