import { IFatores } from '@/interfaces/IFatores'
import styles from './FatoresTableBody.module.scss'
import { FormEvent, Fragment, useRef, useState } from 'react'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import FatoresInput from './FatoresInput/FatoresInput'

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
            <input type="submit" hidden /> {/* Invisible input for form to work */}
        </form>

    </div>
  )
}

export default FatoresTableBody