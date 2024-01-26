import { IValores } from "@/interfaces/IValores"

import styles from './Table.module.css'
import TableHeader from "./TableHeader/TableHeader"
import { IFatores } from "@/interfaces/IFatores"
import TableBody from "./TableBody/TableBody"
import { IProduto } from "@/interfaces/IProduto"

interface TableProps{

    valores: IValores[]
    size?: {maxWidth: '300px'}


    setFatores: (fator: (arr: IFatores) => IFatores) => void
    setValor: (index: number) => ((valor: string) => void)

    controleProdutos: IProduto[]
    setControleProdutos: (fator: (arr:IProduto[]) => IProduto[]) => void
    setFatorAtual: (fator: {fator: string, valor: string}) => void
}


const Table = ({ valores, size, controleProdutos, setFatorAtual, setControleProdutos, setFatores, setValor }: TableProps) => {

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
    
    {controleProdutos.length > 0 ?
    <div 
      className={styles.table}
      style={size}
    >
        <TableHeader
          headers={headers}
        />
        <TableBody  
          controleProdutos={controleProdutos}
          setControleProdutos={setControleProdutos}
          setFatorAtual={setFatorAtual}
          setFatores={setFatores}
          setValor={setValor}
        />
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