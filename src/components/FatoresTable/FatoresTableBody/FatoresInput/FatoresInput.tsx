import { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, RefObject, WheelEvent, WheelEventHandler, useEffect, useRef, useState } from 'react'
import styles from '../NumberInput/NumberInput.module.scss'
import { IFatores } from '@/interfaces/IFatores'

interface FatoresInput {

    label?: string
    placeholder: string
    index: number
    id: string

    formRef: RefObject<HTMLFormElement>

    fator: string
    setFator: (id: string, valor: string) => void
}

const FatoresInput = ({ label, placeholder, fator, setFator, index, id, formRef }: FatoresInput) => {

  const inputRef = useRef<HTMLInputElement>(null)

  const [disabled, setDisabled] = useState((fator === '') ? false : true)
  const [firstMount, setFirstMount] = useState(true)

  const handleChangeValor = (e: ChangeEvent<HTMLInputElement>) => {

    
    const padrao = /[^0-9|,.]$/
    if (padrao.test(e.target.value)) return
    
    const valorNumerico = e.target.value
    .replace(/\./g, ',')
    .replace(/\,{2,}/g,',')
    .replace(/^0*([^0]\d*\,\d{1,4}).*/g, "$1");
    
    // console.log(valorNumerico);
    // if(setFatorAtual) setFatorAtual({fator: id, valor: valorNumerico});

    (valorNumerico !== '')
      // ? setFator((prev) => {
      //   const updateFator = {...prev, [id]: valorNumerico}
      //   return updateFator
      // }) 
      ? setFator(id, valorNumerico)
      : setFator(id, '')
      // : setFator((prev) => {
      //   const resetFator = {...prev, [id]: ''}
      //   return resetFator
      // })
    
  }


  const handleDisable = () => {

    setDisabled(false)
    if (!disabled) inputRef.current!.focus()
    
  }

  const handleBlur = () => {
    
    if (fator !== '') {

      setDisabled(true)

    }

  }

  useEffect(() => {

    // if (firstMount) {

    //   if (fator !== '') setDisabled(true)

    // }

    if (!firstMount) {
      inputRef.current!.focus();
    }
    setFirstMount(false);
  }, [disabled]);

  return (
    <div 
      className={styles.container}
      // onClick={handleDisable}
    >
        {label
         ? <label className={styles.label}>{label}</label>
         : <></>
        }
        <input 
            className={styles.inputFont}
            ref={inputRef}
            disabled={disabled}
            required={true}
            type="text" 
            value={fator}
            inputMode='numeric'
            // onClick={handleDisable}
            onFocus={(e)=>e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
            onChange={handleChangeValor}
            onBlur={handleBlur}
            placeholder={placeholder}
        />
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

