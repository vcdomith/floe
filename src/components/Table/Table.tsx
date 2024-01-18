import { IValores } from "@/interfaces/IValores"

import styles from './Table.module.css'
import { useEffect, useState } from "react"

interface TableProps {
    valores: IValores[]
}


const Table = ({ valores }: TableProps) => {

    const lastRowClass = (index: number, valores: IValores[]) => {
    
        return index === valores.length - 1
        ? styles.lastRow
        : styles.tr
    
    }

  return (
    <>
    
    {valores.length > 0 ?
    <table className={styles.table}>
        <thead className={styles.thead}>
            <tr>
                <th className={styles.th}>Valor Unitário</th>
                <th className={styles.th}>Valor Tabela 1</th>
                <th className={styles.th}>Valor Tabela 2</th>
                <th className={styles.th}>Valor Tabela 3</th>
            </tr>
        </thead>
        <tbody className={styles.tbody}>
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
        </tbody>
    </table>
    : <div>Sem dados</div>
    }
    </>
  )
}

export default Table