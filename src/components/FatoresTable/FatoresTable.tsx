
import { IFatores } from '@/interfaces/IFatores'
import TableHeader from '../Table/TableHeader/TableHeader'
import FatoresTableBody from './FatoresTableBody/FatoresTableBody'
import styles from './FatoresTable.module.scss'
import { FormEvent, useEffect, useState } from 'react'

interface FatoresTableProps {

  fatores: IFatores
  setFatores: (id: string, valor: string) => void

  valor: string
  setValor: (valor: string ) => void

  handleSubmit: (evento: FormEvent<HTMLFormElement>) => void

  display?: boolean

  setFatorAtual?: (fator: {fator: string, valor: string}) => void

}

const FatoresTable = ({ fatores, setFatores, valor, setValor, handleSubmit, setFatorAtual, display = true }: FatoresTableProps) => {

  return (
    <span
      className={styles.table}
      style={{display: `${display? 'block' :' none'}`}}
    >
      <TableHeader
        headers={['Origem', 'Fator']} 
      />
      <FatoresTableBody
        setFatorAtual={setFatorAtual}
        fatores={fatores}
        setFatores={setFatores}
        valor={valor}
        setValor={setValor}
        handleSubmit={handleSubmit}
         />
      
    </span>
  )
}

export default FatoresTable