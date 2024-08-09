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

interface TabelaRowProps {

    produto: ProdutoCadastro
    setTabela: Dispatch<SetStateAction<ProdutoCadastro[]>>

}

const TabelaRow = forwardRef<HTMLSpanElement, TabelaRowProps>(
function TabelaRow({produto, setTabela}: TabelaRowProps, ref) {

    const {id, codigo, ncm, st, unitario, unitarioNota, composto, fatores } = produto
    const {tabela1, tabela2, tabela3} = useMemo(() => getTabelasObject(produto), [produto])

    const {fornecedorContext, produtoContext, removeProduto} = useCalcular()
    const { handleProdutoChange } = produtoContext

    const { setModal, clearModal } = useModal()

    const handleClick = (id: number) => {

        setModal(
            <ConfirmationDialog 
                title={`Confirme a exclusão do produto ${produto.codigo}:`}
                message='Aviso: o produto será excluído permanentemente!' 
                cancelHandler={clearModal} 
                confirmHandler={() => removeProduto(id)}                
            />
        )

    }

    return (

        <motion.span 
            className={style.row}

            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10, width: '100px' }}
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
                        
                        <button 
                            onClick={() => setModal( 
                                <ProdutoDetalhes 
                                    produto={produto}
                                /> 
                            )}
                        >
                            |||
                        </button>
        
                        <button onClick={() => handleClick(id)}>X</button>
                    </span>
                </div>
        </motion.span>

    )

})

// const DetalhesProduto = ({ produto, handleProdutoChange }: 
//     { 
//         produto: ProdutoCadastro, 
//         handleProdutoChange: <T>(field: keyof IProdutoContext) => (valor: T) => void
//     }
// ) => {
//     return (
//         <div
//             id={`fatores${produto.id}`} 
//             style={{ width: 'fit-content'}}
//         >
//             <div className={style.popoverWrap}>

//                 <span className={style.header}>
//                     <SvgProduto_3D />
//                     <h3>Produto</h3>
//                     <h3>{produto.codigo}</h3>
//                 </span>

//                 <div className={style.atributos}>
//                     <Config 
//                         svg={svgsUtil.st} 
//                         title={'ST:'} 
//                         description={''}
//                         input={
//                             <CheckBox 
//                                 checked={produto.st}
//                                 setChecked={handleProdutoChange('st')}
//                                 disabled
//                             />
//                         }
//                     />
//                     <Config
//                         svg={svgsUtil['unitario']} 
//                         title={'Unitário'} 
//                         description={''}
//                         input={
//                             <input
//                                 className={style.codigo}
//                                 type="text" 
//                                 placeholder="_____________"
//                                 value={produto.unitario}
//                                 required
//                                 disabled
//                             />
//                         }
//                     />
//                     <Config
//                         svg={svgsUtil['ncm']} 
//                         title={'NCM'} 
//                         description={''}
//                         input={
//                             <input
//                                 className={style.codigo}
//                                 type="text" 
//                                 placeholder="_____________"
//                                 value={produto.ncm}
//                                 required
//                                 disabled
//                             />
//                         }
//                     />
//                     <Config
//                         svg={svgsUtil['unitarioNota']} 
//                         title={'Unit. Nota'} 
//                         description={''}
//                         input={
//                             <input
//                                 className={style.codigo}
//                                 type="text" 
//                                 placeholder="_____________"
//                                 value={produto.unitarioNota}
//                                 required
//                                 disabled
//                             />
//                         }
//                     />
                    
//                 </div>

//                 <div className={style.title}>
//                     <h5>Fatores</h5>
//                 </div>
//                 <div className={style.fatores}>
//                 {Object.entries(produto.fatores)
//                     .filter( ([key, value]) => (value !== '1' || key === 'base'))
//                     .map(([key, value]) => 
//                         <Config
//                             key={key} 
//                             svg={svgsUtil[key as keyof FatoresContext]} 
//                             title={key} 
//                             description={'Código do produto Código do produto Código do produto'}
//                             input={
//                                 <input
//                                     className={style.codigo}
//                                     type="text" 
//                                     placeholder="_____________"
//                                     value={value}
//                                     required
//                                     disabled
//                                 />
//                             }
//                         />
//                     )
//                 }
//                 </div>

//             </div>
//         </div>
//     )
// }

// const ProdutoDetalhes = ({ produto }: {produto: ProdutoCadastro}) => {

//     return (
//         <div>
//             <Config 
//                 svg={svgsUtil[produto]} 
//                 title={'Código'} 
//                 description={'Código do produto'}
//                 input={
//                     <input
//                         className={style.codigo}
//                         type="text" 
//                         placeholder="_____________"
//                         value={produto.codigo}
//                         required
//                         disabled
//                     />
//                 }
//             />
//         </div>
//     )

// }

export default TabelaRow

const SvgProduto_3D = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M449 135L250 20L51 135V365L250 480L449 365V135Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M449 365V135L250 250.649V480L449 365Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M449 135L250 20L51 135L250 250.649L449 135Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M51 365L250 480V250.649L51 135V365Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        </svg>
    )
}