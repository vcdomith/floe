import { getTabelasObject } from '@/utils/calculoTabelas'
import { produtoCadastro } from '../../context/CalcularContext'
import style from './TabelaRow.module.scss'
import { Dispatch, SetStateAction, forwardRef, useMemo } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { update } from '@react-spring/web'

interface TabelaRowProps {

    produto: produtoCadastro
    setTabela: Dispatch<SetStateAction<produtoCadastro[]>>

}

const TabelaRow = forwardRef<HTMLSpanElement, TabelaRowProps>(
function TabelaRow({produto, setTabela}: TabelaRowProps, ref) {

    const {id, codigo, ncm, st, unitario, unitarioNota, composto, fatores } = produto
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

            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: .3 }}
            ref={ref}
            layout
        >
                <div>
                    <p className={style.st} data-st={st}>{ st ? 'ST' : '' }</p>
                </div>
                {/* <div>{ codigo }</div> */}
                <div className={style.composto}>
                    <p className={style.main}>{ codigo }</p>      
                    {ncm !== ''&&
                    <p className={style.second}>{ ncm || '_'.repeat(codigo.length) }</p>
                    }
                </div>
                <div className={style.composto}>
                    <p className={style.main}>{ unitario }</p>
                    {(composto?.every(item => item !== ''))&&
                    <p className={style.second}>{ `(${composto[0]} + ${composto[1]})` }</p>
                    }
                </div>
                <div>{ tabela1.toFixed(2) }</div>
                {/* <div>{ tabela2 }</div> */}
                <div className={style.composto}>
                    <p className={style.main}>{ tabela2.toFixed(2) }</p>      
                    <p className={style.second}>{ unitarioNota }</p>
                </div>
                <div>{ tabela3.toFixed(2) }</div>
                <div>
                    <span className={style.tools}>
                        <button popoverTarget="fatores">|||</button>
                        {/* <button popOverTarget="popover">Toggle popover</button> */}
                        <div
                            id="fatores" popover='auto' 
                            style={{ width: 'fit-content'}}
                        >
                            <div>
                                {Object.entries(produto.fatores).map(([key, value]) => 
                                    <span key={key}>
                                        <h3>{key}</h3>
                                        <h3>{value}</h3>
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => handleClick(id)}>X</button>
                    </span>
                </div>
        </motion.span>

    )

})

export default TabelaRow