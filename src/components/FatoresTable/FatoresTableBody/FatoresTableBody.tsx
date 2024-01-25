import { IFatores } from '@/interfaces/IFatores'
import styles from './FatoresTableBody.module.scss'

import { FormEvent, Fragment, useRef, useState } from 'react'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import FatoresInput from './FatoresInput/FatoresInput'
import { IValores } from '@/interfaces/IValores'

interface FatoresTableBody {

    fatores: IFatores
    setFatores: (fator: (arr: IFatores) => IFatores) => void

    valor: string
    setValor: (valor: string ) => void

    handleSubmit: (evento: FormEvent<HTMLFormElement>) => void

}

const FatoresTableBody = ({ fatores, setFatores, valor, setValor, handleSubmit }: FatoresTableBody) => {

    const formRef = useRef<HTMLFormElement>(null)

    const origemLookupTable: IFatores = {
        padrao: 'Padrão',
        st: 'ST',
        transporte: 'Transporte',
        fator: 'Fator',
        ipi: 'IPI'
    }

    // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    //     e.preventDefault()

    //     // const fatoresArr = Object.entries(fatores)
    //     // const fatoresVazios = fatoresArr.filter(([origem, fator], index) => fator === '')

    //     // console.log(fatoresVazios.length)

    //     // adicionaValores()

    // }

  return (
    <div className={styles.container}>
        <div className={styles.labelList}>
        {Object.keys(fatores).map((origem: string, index: number) => 
            <p key={index}>{origemLookupTable[origem as keyof IFatores]}</p>
        )}
            <p>Valor Unitário</p>
        </div>
        <form
        ref={formRef} 
            onSubmit={handleSubmit}
            // onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        >
            {Object.entries(fatores).map(([origem, fator], index) => 
                <FatoresInput 
                    formRef={formRef}
                    key={index}
                    id={origem}
                    index={index}
                    placeholder='Insira o fator' 
                    fator={fator}
                    setFator={setFatores}
                />
            )}
            <NumberInput 
                placeholder={'Insira o valor unitário'} 
                valor={valor} 
                setValor={setValor}
            />
            <input type="submit" hidden />
            {/* <button>Adicionar</button> invisble button for form to work */}
        </form>

    </div>
  )
}

export default FatoresTableBody