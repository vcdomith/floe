import { IValores } from "@/interfaces/IValores"

import styles from './Table.module.css'
import { useEffect, useState } from "react"
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
            'Valores Unitários',
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
    <table className={styles.table}>
        <TableHeader
            headers={headers}
        />
        <TableBody valores={valores} />
    </table>
    : <div>Sem dados</div>
    }
    </>
  )
}

{/* <thead className={styles.thead}>
            <tr>
                <th className={styles.th}>Valor Unitário</th>
                <th className={styles.th}>Valor Tabela 1</th>
                <th className={styles.th}>Valor Tabela 2</th>
                <th className={styles.th}>Valor Tabela 3</th>
            </tr>
        </thead> */}
        {/* <tbody className={styles.tbody}>
            {valores.map((produto, index) => 
                <tr 
                    className={index === valores.length - 1 
                                        ? styles.lastRow 
                                        : styles.tr
                              } 
                    key={index}
                >
                    <td className={styles.first}>{(produto.unitario).toFixed(2)}</td>
                    <td>{(produto.tabela1).toFixed(2)}</td>
                    <td>{(produto.tabela2).toFixed(2)}</td>
                    <td className={styles.last}>{(produto.tabela3).toFixed(2)}</td>
                </tr>
            
                )}
        </tbody> */}

export default Table