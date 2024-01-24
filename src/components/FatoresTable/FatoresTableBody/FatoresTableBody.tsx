import { IFatores } from '@/interfaces/IFatores'
import './FatoresTableBody.scss'
import NumberInputFatores from '@/components/FatoresInput/FatoresInput'
import { FormEvent, Fragment, useState } from 'react'
import NumberInput from '@/components/NumberInput/NumberInput'
import { IValores } from '@/interfaces/IValores'

interface FatoresTableBody {

    fatores: IFatores
    setFatores: (fator: (arr: IFatores) => IFatores) => void

    valor: string
    setValor: (valor: string ) => void

}

const FatoresTableBody = ({ fatores, setFatores, valor, setValor }: FatoresTableBody) => {

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const fatoresArr = Object.entries(fatores)
        const fatoresVazios = fatoresArr.filter(([origem, fator], index) => fator === '')

        console.log(fatoresVazios.length)
        

    }

  return (
    <div>
        <div>
        {Object.keys(fatores).map((origem: string, index: number) => 
            <div key={index}>{origem}</div>
        )}
        </div>
        <form onSubmit={handleSubmit}>
            {Object.entries(fatores).map(([origem, fator], index) => 
                <NumberInputFatores 
                    key={index}
                    id={origem}
                    index={index}
                    placeholder={`Insira a porcentagem de ${origem}`} 
                    fator={fator}
                    setFator={setFatores}
                />
            )}
            <NumberInput 
                placeholder={'Insira o valor unitário'} 
                valor={valor} 
                setValor={setValor}
            />
            <button>Adicionar</button>
        </form>

    </div>
  )
}

export default FatoresTableBody