import { getTabelasObject } from '@/utils/calculoTabelas'
import { FatoresContext, ProdutoCadastro, useCalcular } from '../../context/CalcularContext'
import style from './TabelaRow.module.scss'
import { Dispatch, SetStateAction, forwardRef, useMemo } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { update } from '@react-spring/web'
import Config from '@/app/(app)/configurar/(Config)/Config'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import CheckBox from '@/app/(app)/configurar/(CheckBox)/CheckBox'
import { useModal } from '@/app/(app)/(contexts)/ModalContext'
import { IProdutoContext } from '@/hooks/useProduto'
import ProdutoDetalhes from '@/components/ProdutoDetalhes/ProdutoDetalhes'
import ConfirmationDialog from '@/components/ConfirmationDialog/ConfirmationDialog'
import { useNotification } from '@/app/(app)/(contexts)/NotificationContext'
import { useMediaQuery } from '@/app/(app)/(contexts)/MediaQueryContext'

interface TabelaRowProps {

    produto: ProdutoCadastro
    setTabela: Dispatch<SetStateAction<ProdutoCadastro[]>>

}

const TabelaRow = forwardRef<HTMLSpanElement, TabelaRowProps>(
function TabelaRow({produto, setTabela}: TabelaRowProps, ref) {

    const {id, codigo, ncm, st, unitario, unitarioNota, composto, fatores } = produto
    const {tabela1, tabela2, tabela3} = useMemo(() => getTabelasObject(produto), [produto])

    const { fornecedorContext, produtoContext, removeProduto, calcularSection } = useCalcular()
    const {addNotification} = useNotification()
    const { handleProdutoChange } = produtoContext
    const { matches: isMobile } = useMediaQuery()

    const { setModal, clearModal } = useModal()

    const handleClick = (id: number) => {

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
                    <p className={style.main}>{ unitario }</p>
                    {(composto?.every(item => item !== ''))&&
                    <p className={style.second}>{ `(${composto[0]} + ${composto[1]})` }</p>
                    }
                </div>
                <div>
                    <label className={style.label}>tabela 1</label>
                    <p>{ tabela1.toFixed(2) }</p>
                </div>
                {/* <div>{ tabela2 }</div> */}
                <div className={style.composto}>
                    <label className={style.label}>tabela 2</label>
                    <p className={style.main}>{ tabela2.toFixed(2) }</p>      
                    <p className={style.second}>{ unitarioNota }</p>
                </div>
                <div>
                    <label className={style.label}>tabela 3</label>
                    <p>{ tabela3.toFixed(2) }</p>
                </div>
                <div>
                    <span className={style.tools}>
                        
                        <button 
                            onClick={() => setModal( 
                                <ProdutoDetalhes 
                                    produto={produto}
                                /> 
                            )}
                        >
                            <SvgDetalhes />
                        </button>
        
                        <button onClick={() => handleClick(id)}><SvgExcluir/></button>
                    </span>
                </div>
        </motion.span>

    )

})

export default TabelaRow

const SvgExcluir = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M156 345L346 155" stroke="black" strokeWidth="40"/>
            <path d="M155 155L345 345" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
// const SvgExcluir = () => {
//     return(
//         <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M130 193L130 400L370 400L370 193" stroke="black" strokeWidth="40"/>
//         <path d="M71 139L430 139" stroke="black" strokeWidth="40"/>
//         <path d="M174 99L326 99" stroke="black" strokeWidth="40"/>
//         <path d="M207 193L207 350" stroke="black" strokeWidth="40"/>
//         <path d="M291 193L291 350" stroke="black" strokeWidth="40"/>
//         </svg>
 
//     )
// }
const SvgDetalhes = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M117 161H383" stroke="black" strokeWidth="40"/>
            <path d="M117 250H383" stroke="black" strokeWidth="40"/>
            <path d="M117 339H383" stroke="black" strokeWidth="40"/>
        </svg>
    )
}