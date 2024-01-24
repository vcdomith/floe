
import { IFatores } from '@/interfaces/IFatores'
import TableHeader from '../Table/TableHeader/TableHeader'
import FatoresTableBody from './FatoresTableBody/FatoresTableBody'
import './Fatorestable.module.scss'

interface FatoresTableProps {

  fatores: IFatores
  setFatores: (fator: (arr: IFatores) => IFatores) => void

  valor: string
  setValor: (valor: string ) => void

}

const FatoresTable = ({ fatores, setFatores, valor, setValor }: FatoresTableProps) => {
  return (
    <div
      className=''
    >
      <TableHeader headers={['Origem', 'Fator']} />
      <FatoresTableBody
        fatores={fatores}
        setFatores={setFatores}
        valor={valor}
        setValor={setValor}
         />
      
    </div>
  )
}

export default FatoresTable