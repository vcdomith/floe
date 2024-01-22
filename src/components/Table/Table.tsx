import { IValores } from "@/interfaces/IValores"

import styles from './Table.module.css'
import TableHeader from "./TableHeader/TableHeader"
import { IFatores } from "@/interfaces/IFatores"
import TableBody from "./TableBody/TableBody"

interface TableProps<T extends IValores[] | IFatores[]> {
    valores: T

}


const Table = <T extends IValores[] | IFatores[],>({ valores }: TableProps<T>) => {

    interface Headers<T = string>{
        valores: [T, T, T, T],
        fatores: [T, T]
      }
    
    const tableHeaders: Headers = {
        
        valores: [
            'Valor Unitário',
            'Valor Tabela 1',
            'Valor Tabela 2',
            'Valor Tabela 3'
        ],

        fatores: [
            'Origem',
            'Fator'
        ]
    }

    let headers = (valores[0] && 'unitario' in valores[0])
        ? tableHeaders.valores 
        : tableHeaders.fatores 
            

  return (
    <>
    
    {valores.length > 0 ?
    <div className={styles.table}>
        <TableHeader
            headers={headers}
        />
        <TableBody valores={valores} />
    </div>
    : <div
        className={styles.empty}
      >
        <p>Sem dados</p>
      </div>
    }
    </>
  )
}

export default Table