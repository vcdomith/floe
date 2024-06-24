import { getTabelasObject } from '@/utils/calculoTabelas'
import { produtoCadastro } from '../../context/CalcularContext'
import style from './TabelaRow.module.scss'
import { Dispatch, SetStateAction, forwardRef, useMemo } from 'react'
import {motion} from 'framer-motion'
import { update } from '@react-spring/web'

interface TabelaRowProps {

    produto: produtoCadastro
    setTabela: Dispatch<SetStateAction<produtoCadastro[]>>

}

const TabelaRow = forwardRef(
function TabelaRow({produto, setTabela}: TabelaRowProps) {

    const {id, codigo, st, unitario, unitarioNota, composto, fatores } = produto
    const {tabela1, tabela2, tabela3} = useMemo(() => getTabelasObject(produto), [produto])

    const handleClick = (id: number) => {

        setTabela(prev => {
            const updated = [...prev]
            const removed = updated.filter( produto => produto.id !== id )
            // console.log(itemToRemove);
            // updated.splice(updated.indexOf(itemToRemove), 1)
            return removed
        })

    }

    return (

        <motion.span 
            className={style.row}

            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
        >
            <div>
                <p className={style.st} data-st={st}>{ st ? 'ST' : '' }</p>
            </div>
            <div>{ codigo }</div>
            <div className={style.composto}>
                <p className={style.main}>{ unitario }</p>
                {(composto?.every(item => item !== ''))&&
                <p className={style.second}>{ `(${composto[0]} + ${composto[1]})` }</p>
                }
            </div>
            <div>{ tabela1 }</div>
            {/* <div>{ tabela2 }</div> */}
            <div className={style.composto}>
                <p className={style.main}>{ tabela2.toFixed(2) }</p>      
                <p className={style.second}>{ unitarioNota }</p>
            </div>
            <div>{ tabela3 }</div>
            <div>
                <button onClick={() => alert(JSON.stringify(fatores))}>|||</button>
                <button onClick={() => handleClick(id)}>X</button>
            </div>
        </motion.span>

    )

})

export default TabelaRow