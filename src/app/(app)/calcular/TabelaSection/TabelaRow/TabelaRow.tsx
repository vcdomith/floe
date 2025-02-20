'use client'
import { getTabelasObject } from '@/utils/calculoTabelas'
import { ProdutoCadastro, useCalcular } from '../../context/CalcularContext'
import style from './TabelaRow.module.scss'
import { forwardRef, useMemo } from 'react'
import {motion} from 'framer-motion'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import { useModal } from '@/app/(app)/(contexts)/ModalContext'
import { ProdutoEdit } from '@/components/ProdutoDetalhes/ProdutoEdit'
import ConfirmationDialog from '@/components/ConfirmationDialog/ConfirmationDialog'
import { useNotification } from '@/app/(app)/(contexts)/NotificationContext'
import { useMediaQuery } from '@/app/(app)/(contexts)/MediaQueryContext'
import Converter from '@/utils/typeConversion'
import ProdutoDetalhes from '@/components/ProdutoDetalhes/ProdutoDetalhes'

interface TabelaRowProps {

    produto: ProdutoCadastro
    editable?: boolean
    disableTools?: ToolDisable

}

const { stringToFloat } = Converter

type ToolDisable = 'edit' | 'delete' | 'both' | 'none'

const TabelaRow = forwardRef<HTMLSpanElement, TabelaRowProps>(
function TabelaRow({produto, editable = true, disableTools = 'none'}: TabelaRowProps, ref) {

    const { id, codigo, ncm, st, unitario, unitarioNota, composto } = produto
    const { tabela1, tabela2, tabela3 } = useMemo(() => getTabelasObject(produto), [produto])
    const unitarioDisplay = useMemo(() => stringToFloat(unitario).toFixed(2), [unitario])
    const unitarioNotaDisplay = useMemo(() => stringToFloat(unitarioNota).toFixed(2), [unitarioNota])

    const { context } = useCalcular()

    const { 
        context: {
            tabelaContext: { removeProduto }
        } 
    } = context
    const { addNotification } = useNotification()

    const { matches: isMobile } = useMediaQuery()
    const { setModal, clearModal } = useModal()

    const testValue = (value: string) => {
        return (value !== '' && value.at(0) !== '-' && value !== "0.00" && value !== 'NaN')
            ? value
            : '••••••'
    }

    const handleClick = (id: string) => {

        setModal(
            <ConfirmationDialog 
                title={`Confirme a exclusão do produto ${produto.codigo}:`}
                message='Aviso: o produto será excluído permanentemente!' 
                cancelHandler={clearModal} 
                confirmHandler={() => {
                    addNotification({
                        tipo: 'sucesso',
                        mensagem: `Produto ${produto.codigo} excluído com sucesso!`,
                    })
                    removeProduto(id)
                }}                
            />
        )

    }

    return (

        <motion.span 
            className={style.row}
            onClick={() => {
                if(isMobile) return setModal( 
                    <ProdutoDetalhes 
                        produto={produto}
                    /> 
                )
                return
            }}

            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: .3 }}
            ref={ref}
            layout='position'
            layoutScroll
        >
                <div>
                    <label className={style.label}>tipo</label>
                    <p className={style.st} data-st={st}>{ st ? 'ST' : '' }</p>
                </div>
                {/* <div>{ codigo }</div> */}
                <div className={style.composto}>
                    <label className={style.label}>código</label>
                    <p className={style.main}>{ codigo }</p>      
                    {ncm !== ''&&
                    <p className={style.second}>{ ncm || '_'.repeat(codigo.length) }</p>
                    }
                </div>
                <div className={style.composto}>
                    <label className={style.label}>unitário</label>
                    <p className={style.main}>{ testValue(unitarioDisplay) }</p>
                    {(composto?.every(item => item !== ''))&&
                    <p className={style.second}>{ `(${composto[0]} + ${composto[1]})` }</p>
                    }
                </div>
                <div>
                    <label className={style.label}>tabela 1</label>
                    <p>{ testValue(tabela1.toFixed(2)) }</p>
                </div>
                {/* <div>{ tabela2 }</div> */}
                <div className={style.composto}>
                    <label className={style.label}>tabela 2</label>
                    <p className={style.main}>{ testValue(tabela2.toFixed(2)) }</p>      
                    <p className={style.second}>{ testValue(unitarioNotaDisplay) }</p>
                </div>
                <div>
                    <label className={style.label}>tabela 3</label>
                    <p>{ testValue(tabela3.toFixed(2)) }</p>
                </div>
                <div>
                    <span className={style.tools}>
                        
                        <button 
                            onClick={() => setModal(
                                editable
                                ? 
                                <ProdutoEdit 
                                    produto={produto}
                                />
                                :
                                <ProdutoDetalhes
                                    produto={produto}
                                />
                            )}
                            disabled={
                                disableTools === 'both' ||
                                disableTools === 'edit'
                            }
                        >
                            {svgsUtil.detail}
                        </button>
        
                        <button 
                            onClick={() => handleClick(id)}
                            disabled={
                                disableTools === 'both' ||
                                disableTools === 'delete'
                            }
                        >
                            {svgsUtil.delete}
                        </button>
                    </span>
                </div>
        </motion.span>

    )

})

export default TabelaRow
