import { CalcularProvider, FatoresContext, ProdutoCadastro, useCalcular } from "@/app/(app)/calcular/context/CalcularContext"
import { IProdutoContext } from "@/hooks/useProduto"
import { svgsUtil } from "../SvgArray/SvgUtil"
import Config from "@/app/(app)/configurar/(Config)/Config"
import CheckBox from "@/app/(app)/configurar/(CheckBox)/CheckBox"
import useEditProduto from "@/hooks/useEditProduto"
import NumberInput from "../FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import { Dispatch, SetStateAction, useState } from "react"

import style from './ProdutoDetalhes.module.scss'
import { AnimatePresence, motion } from "framer-motion"
import { useFornecedorReturn } from "@/hooks/useFornecedor"
import { useNotification } from "@/app/(app)/(contexts)/NotificationContext"

const fatoresConfigTextos: Record< 
    keyof FatoresContext, 
    { titulo: string, descricao: string } 
> = {
    base: {
        titulo: "Fator Base",
        descricao: "Fator que todos produtos do fornecedor usam"
    },
    fatorBaseNormal: {
        titulo: "Fator Base Normal",
        descricao: "Fator que os produtos sem ST usam"
    },
    fatorBaseST: {
        titulo: "Fator Base ST",
        descricao: "Fator que os produtos com ST usam"
    },
    transporte: {
        titulo: "Transporte",
        descricao: "Alíquota acrescentada devido ao frete"
    },
    st: {
        titulo: "ST",
        descricao: "Alíquota acrescentada devido a ST ICMS"
    },
    ipi: {
        titulo: "IPI",
        descricao: "Alíquota IPI aplicado ao produto"
    },
    desconto: {
        titulo: "Desconto",
        descricao: "Desconto aplicado ao produto"
    }
}

const disabledFields: (keyof FatoresContext)[] = [
    'base',
    'fatorBaseNormal',
    'fatorBaseST',
    'transporte',
    'st'
]

export const ProdutoDetalhes = ({ produto }: 
    { 
        produto: ProdutoCadastro,
    }
) => {

    const calcularContext = useCalcular()
    console.log(calcularContext.fornecedorContext.fornecedorData);

    const {produtoEdit, handleProdutoChange, handleCompostoChange, handleFatorChange, resetProduto} = useEditProduto(produto)

    const [displayAtributos, setDisplayAtributos] = useState(true)
    const [displayFatores, setDisplayFatores] = useState(false)

    return (
        <div className={style.card}>

            <span className={style.header}>
                {svgsUtil.produto3D}
                <h3>Produto</h3>
                <h3>{produto.codigo}</h3>
            </span>

            <section className={style.content}>

                <span className={style.tag} onClick={() => setDisplayAtributos(prev => !prev)}>
                    <h5>Atributos</h5>
                    <ExpandButton 
                        display={displayAtributos} 
                        setDisplay={setDisplayAtributos}                        
                    />
                </span>

                <AnimatePresence>
                {displayAtributos&&
                <motion.div 
                    className={style.fatores}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                    <Config 
                        svg={svgsUtil.st} 
                        title={'ST:'} 
                        description={''}
                        input={
                            <CheckBox 
                                checked={produtoEdit.st}
                                setChecked={handleProdutoChange('st')}
                                disabled
                            />
                        }
                    />
                    <Config
                        svg={svgsUtil['unitario']} 
                        title={'Unitário'} 
                        description={''}
                        input={
                            <input
                                className={style.codigo}
                                type="text" 
                                placeholder="_____________"
                                value={produtoEdit.unitario}
                                onChange={handleProdutoChange('unitario')}
                                required
                                disabled
                            />
                        }
                    />
                    <Config
                        svg={svgsUtil['ncm']} 
                        title={'NCM'} 
                        description={''}
                        input={
                            <NumberInput 
                                placeholder={""} 
                                valor={produtoEdit.ncm} 
                                setValor={handleProdutoChange('ncm')}                                
                            />
                        }
                    />
                    <Config
                        svg={svgsUtil['unitarioNota']} 
                        title={'Unit. Nota'} 
                        description={''}
                        input={
                            <input
                                className={style.codigo}
                                type="text" 
                                placeholder="_____________"
                                value={produtoEdit.unitarioNota}
                                required
                                disabled
                            />
                        }
                    />
                    
                </motion.div>
                }
                </AnimatePresence>

                <span className={style.tag} onClick={() => setDisplayFatores(prev => !prev)}>
                    <h5>Fatores</h5>
                    <ExpandButton 
                        display={displayFatores} 
                        setDisplay={setDisplayFatores}                        
                    />
                </span>
                <AnimatePresence>
                {displayFatores&&
                <motion.div 
                    className={style.fatores}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                {(Object.entries(produtoEdit.fatores) as [keyof FatoresContext, string][])
                    .filter( ([key, value]) => (value !== '1' || key === 'base'))
                    .map(([key, value]) => 
                        <Config
                            key={key} 
                            svg={svgsUtil[key]} 
                            title={fatoresConfigTextos[key].titulo} 
                            description={fatoresConfigTextos[key].descricao}
                            input={
                                <input
                                    className={style.codigo}
                                    type="text" 
                                    placeholder="_____________"
                                    value={produtoEdit.fatores[key]}
                                    onChange={handleFatorChange(key)}
                                    required
                                    disabled={disabledFields.includes(key)}
                                />
                            }
                        />
                    )
                }
                </motion.div>
                }
                </AnimatePresence>

            </section>

            <span className={style.buttons}>
                <button 
                    className={style.discard}
                    onClick={() => resetProduto()}
                >
                    Descartar
                </button>
                <button className={style.update}>Atualizar</button>
            </span>

        </div>
    )
}

export default ProdutoDetalhes

const ExpandButton = (
    { display, setDisplay }: 
    { display: boolean, setDisplay: Dispatch<SetStateAction<boolean>> }
) => {

    return(
        <button 
            // className={`${style.button} ${style.expand}`} 
            // onClick={() => setDisplay(prev => !prev)} 
        >
            <svg width="20" height="20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d={`${display
                        ? "M376 314L250 188L124 314" 
                        : "M376 187L250 313L124 187"
                    }`}  
                    strokeWidth="50"/>
            </svg>             
        </button>
    )

}