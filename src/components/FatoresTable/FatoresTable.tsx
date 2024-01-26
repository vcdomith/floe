
import { IFatores } from '@/interfaces/IFatores'
import TableHeader from '../Table/TableHeader/TableHeader'
import FatoresTableBody from './FatoresTableBody/FatoresTableBody'
import './FatoresTable.scss'
import { FormEvent } from 'react'

interface FatoresTableProps {

  fatores: IFatores
  setFatores: (fator: (arr: IFatores) => IFatores) => void

  valor: string
  setValor: (valor: string ) => void

  handleSubmit: (evento: FormEvent<HTMLFormElement>) => void

}

const FatoresTable = ({ fatores, setFatores, valor, setValor, handleSubmit }: FatoresTableProps) => {
  return (
    <div
      // className={styles.table}
      className='table'
    >
      <TableHeader
        headers={['Origem', 'Fator']} 
      />
      <FatoresTableBody
        fatores={fatores}
        setFatores={setFatores}
        valor={valor}
        setValor={setValor}
        handleSubmit={handleSubmit}
         />
      
    </div>
  )
}

export default FatoresTable