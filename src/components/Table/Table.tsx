import { IValores } from "@/interfaces/IValores"

import styles from './Table.module.scss'
import TableHeader from "./TableHeader/TableHeader"
import { IFatores } from "@/interfaces/IFatores"
import TableBody from "./TableBody/TableBody"
import { IProduto } from "@/interfaces/IProduto"
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface TableProps{

    valores: IValores[]
    size?: {maxWidth: '300px'}

    setFatores: (index: number) => (id: string, valor: string) => void
    setValor: (index: number) => ((valor: string) => void)

    controleProdutos: IProduto[]
    setControleProdutos: (fator: (arr:IProduto[]) => IProduto[]) => void
    filtros: { searchParam: string, sorted: false | "ascending" | "descending" }

    fatoresDisplay: boolean[]
    setFatoresDisplay: Dispatch<SetStateAction<boolean[]>>

    getIndex: (id: number) => number
}


const Table = ({ valores, size, controleProdutos, setControleProdutos, setFatores, setValor, setFatoresDisplay, getIndex, filtros, fatoresDisplay }: TableProps) => {

    const [modalDisplay, setModalDisplay] = useState(false)

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
    // <AnimatePresence>
    // <motion.div
    //   className={`${styles.div} ${controleProdutos.length > 0 ? styles.table : styles.empty}`}
    //   style={{ overflow: `${fatoresDisplay.includes(true) ? 'visible' : 'hidden' }` }}

    //   initial={{ opacity: 0, height: 0 }}
    //   animate={{ opacity: 1, height: 'auto' }}
    //   exit={{ opacity: 0, height: 0 }}
    // >
    //   {controleProdutos.length > 0 
    //   ?
    //   <>
    //   <TableHeader
    //       headers={tableHeaders.valores}
    //     />
    //   <TableBody  
    //     controleProdutos={controleProdutos}
    //     setControleProdutos={setControleProdutos}
    //     filtros={filtros}
    //     setFatores={setFatores}
    //     setValor={setValor}
    //     fatoresDisplay={fatoresDisplay}
    //     setFatoresDisplay={setFatoresDisplay}
    //     getIndex={getIndex}
    //   />
    //   </>
    //   :
    //   <p>Sem dados</p>
    //   }
    // </motion.div>
    // </AnimatePresence>
    <AnimatePresence mode="popLayout">
    {controleProdutos.length > 0 ?
    <motion.div 
      className={styles.table}
      style={{ overflow: `${modalDisplay ? 'visible' : 'hidden' }` }}

      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
        <TableHeader
          headers={tableHeaders.valores}
        />
        <TableBody  
          controleProdutos={controleProdutos}
          setControleProdutos={setControleProdutos}
          filtros={filtros}
          setFatores={setFatores}
          setValor={setValor}
          setModalDisplay={setModalDisplay}
          fatoresDisplay={fatoresDisplay}
          setFatoresDisplay={setFatoresDisplay}
          getIndex={getIndex}
        />
    </motion.div>
    : <div
        className={styles.empty}
      >
        <p>Sem dados</p>
      </div>
    }
    </AnimatePresence>
  )
}

export default Table