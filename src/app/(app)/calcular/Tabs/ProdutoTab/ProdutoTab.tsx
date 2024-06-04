'use client'

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

import style from '../FornecedorTab/FornecedorTab.module.scss'
import Config from "@/app/(app)/configurar/(Config)/Config"
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import CheckBox from "@/app/(app)/configurar/(CheckBox)/CheckBox"

export default function ProdutoTab() {

    const [displayProdutoTab, setDisplayProdutoTab] = useState(false)

    const [produtoComST, setProdutoComST] = useState(false)
    const [codigoProduto, setCodigoProduto] = useState('')
    const [desconto, setDesconto] = useState('')

    return (
        <div className={style.wrap}>
            <span className={style.tab}>
                <span className={style.title}>
                    <SvgProduto />
                    <h3>Produto</h3>
                </span>
                <span className={style.selectWrap}>
                    <button 
                        className={style.button} 
                        onClick={() => setDisplayProdutoTab(prev => !prev)} 
                    >
                        <svg fill="#000000" 
                        width="25px"viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d={`${displayProdutoTab
                                    ? "M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"
                                    : "M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"
                                }`}
                            />
                        </svg>              
                    </button>
                </span>
            </span>
            <AnimatePresence>
                {displayProdutoTab&&
                <motion.div className={style.list}
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                    <div className={style.fornecedorConfigs}>
                        {/* <div className={style.configWrapper}> */}
                        <form onSubmit={(e) => e.preventDefault()}>
                            <Config 
                                    svg={<SvgFornecedor/>} 
                                    title={'Produto c/ ST'} 
                                    description={'Produto possuí Substituição Tributária?'}
                                    input={
                                        <CheckBox 
                                            checked={produtoComST}
                                            setChecked={setProdutoComST}
                                        />
                                    }
                            />
                            <Config 
                                svg={<SvgFornecedor/>} 
                                title={'Código'} 
                                description={'Código do produto'}
                                input={
                                    <input 
                                        type="text" 
                                        value={codigoProduto}
                                        onChange={(e) => setCodigoProduto(e.target.value)}
                                        required
                                    />
                                }
                            />
                            <Config 
                                svg={<SvgFornecedor/>} 
                                title={'Fator Transporte'} 
                                description={'Calcula o fator acrescentado devido ao frete'}
                                input={
                                    <NumberInput 
                                        placeholder={'______'} 
                                        valor={desconto} 
                                        setValor={setDesconto}  
                                        required
                                    />
                                }
                            />
                            <button type="submit" hidden></button>
                        </form>
                        {/* </div> */}
                    </div>
                </motion.div>
                }
            </AnimatePresence>
        </div>
    )

}

const SvgFornecedor = () => {
    return (
        <svg className={style.svgFornecedor} width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M463 437.5C426.388 437.619 412.769 374.8 342.5 375C272.231 375.201 266.172 437.5 197.5 437.5C133.619 437.5 68.0749 387.76 37 387.277" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M463 342.5C426.388 342.619 412.769 279.8 342.5 280C272.231 280.201 266.172 342.5 197.5 342.5C133.619 342.5 68.0749 292.76 37 292.277" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M169 144L50.5 181.5C101.414 241.835 195.827 310.885 236.5 322.284L328.5 279C395 264.5 411.5 183.5 444 134.5L169 144Z" fill="none" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="bevel"/>
            <path d="M271 142V99.4808M271 99.4808V43L202 70.9231L271 99.4808Z" stroke="#E8D4B0" strokeWidth="40"/>
        </svg>
    )
}

const SvgProduto = () => {
    return(
        <svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 150.278 180.487 198.278 211.82" stroke="#591C4A" strokeWidth="40"/>
        <path d="M474.07 98.893C465.57 92.393 350.07 7.89299 305.57 43.893C261.07 79.893 498.57 212.393 474.07 298.893C454.47 368.093 353.57 322.726 305.57 291.393" stroke="#591C4A" strokeWidth="40"/>
        <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
        </svg>
    )
}