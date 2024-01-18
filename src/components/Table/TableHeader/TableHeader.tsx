import { IValores } from '@/interfaces/IValores'
import './TableHeader.scss'
import { IFatores } from '@/interfaces/IFatores'

interface TableHeaderProps {

    headers: 'valores' | 'fatores'

}

const TableHeader = ({ headers }: TableHeaderProps) => {

  return (
    <thead>
        <tr>
            {headers === 'valores' 

                ? (
                    <>
                    <th>Valor Unitário</th>
                    <th>Valor Tabela 1</th>
                    <th>Valor Tabela 2</th>
                    <th>Valor Tabela 3</th>
                    </>
                )

                : (
                    <>
                    <th>Origem</th>
                    <th>Fator</th>
                    </>
                )
            }
    
        </tr>
    </thead>
  )
}

export default TableHeader