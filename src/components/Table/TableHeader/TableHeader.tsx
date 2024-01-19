import { IValores } from '@/interfaces/IValores'
import './TableHeader.scss'
import { IFatores } from '@/interfaces/IFatores'

interface TableHeaderProps {

    headers: string[]

}

const TableHeader = ({ headers }: TableHeaderProps) => {

  return (
    <thead>
        <tr>
            {headers.map(
                (header, index) => 
                <th key={index}>{header}</th>)}
        </tr>
    </thead>
  )
}

export default TableHeader