'use client'

import { motion, AnimatePresence } from "framer-motion"
import { FormEvent, KeyboardEvent, MouseEvent, useRef, useState } from "react"

import style from '../FornecedorTab/FornecedorTab.module.scss'
import styleProduto from './ProdutoTab.module.scss'

import Config from "@/app/(app)/configurar/(Config)/Config"
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import CheckBox from "@/app/(app)/configurar/(CheckBox)/CheckBox"
import { useCalcular } from "../../context/CalcularContext"
import Converter from "@/utils/typeConversion"
import { IProdutoContext } from "@/hooks/useProduto"

const NUMBER_INPUT_PLACEHOLDER = '_'.repeat(50)

export default function ProdutoTab() {

    const {produtoContext, fornecedorContext, submitForm, displayControl} = useCalcular()
    const {produtoData: {
        st,
        codigo,
        desconto,
        ipi,
        ipiProporcional,
        unitarioNota,
        unitarioPedido,
        unitarioComposto,
        composto1,
        composto2,
    }, setProdutoData, handleProdutoChange, handleProdutoSubmit, resetForm} = produtoContext
    const {fornecedorData: { fatorBase, usaUnitarioPedido }, handleFornecedorChange} = fornecedorContext

    const [displayProdutoTab, setDisplayProdutoTab] = useState(false)

    // const [produtoComST, setProdutoComST] = useState(false)
    // const [codigoProduto, setCodigoProduto] = useState('')
    // const [desconto, setDesconto] = useState('')

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const {stringToFloat, floatToString} = Converter
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {

        if(e.key === 'Enter') {
            
            const calculoUnitario = stringToFloat(composto1) + stringToFloat(composto2)

            setProdutoData(prev => ({...prev, ['unitarioComposto' as keyof IProdutoContext]: calculoUnitario}))
            e.preventDefault()
        } 

    }

    return (
        <div className={style.wrap}>
            <span className={style.tab}>
                <span className={style.title}>
                    <SvgProduto />
                    <h3>Produto</h3>
                </span>
                <span className={style.selectWrap}>
                    <button 
                        className={`${style.button} ${style.expand}`} 
                        onClick={() => setDisplayProdutoTab(prev => !prev)} 
                    >
                        <svg width="25" height="25" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d={`${displayProdutoTab
                                    ? "M376 314L250 188L124 314" 
                                    : "M376 187L250 313L124 187"
                                }`}  
                                strokeWidth="50"/>
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
                        {/* Trocar onSubmit pela função a ser recebida do context */}
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <Config 
                                    svg={<SvgST/>} 
                                    title={'Produto com ST?'} 
                                    description={'Produto usa Subst. Trib.'}
                                    input={
                                        <CheckBox 
                                            checked={st}
                                            setChecked={handleProdutoChange('st')}
                                        />
                                    }
                            />
                            <Config 
                                svg={<SvgFornecedor/>} 
                                title={'Código'} 
                                description={'Código do produto'}
                                input={
                                    <input
                                        className={style.codigo} 
                                        type="text" 
                                        placeholder="_____________"
                                        value={codigo}
                                        onChange={(e) => handleProdutoChange('codigo')(e.target.value.toUpperCase())}
                                        required
                                    />
                                }
                            />
                            {displayControl.desconto&&
                            <Config 
                                svg={<SvgDesconto/>} 
                                title={'Desconto'} 
                                description={'Desconto aplicado ao produto:'}
                                input={
                                    <NumberInput 
                                        placeholder={'______'} 
                                        valor={desconto} 
                                        setValor={handleProdutoChange('desconto')}  
                                        required
                                    />
                                }
                            />
                            }
                            {/* <Config 
                                svg={<SvgIPI/>} 
                                title={'IPI'} 
                                description={'Aliquiota IPI aplicado ao produto:'}
                                input={
                                    <NumberInput 
                                        placeholder={'______'} 
                                        valor={ipi} 
                                        setValor={handleProdutoChange('ipi')}  
                                        required
                                    />
                                }
                            /> */}
                            {displayControl.ipi&&
                            <div className={`${style.configWrapper} ${styleProduto.configWrapper}`}>
                                <Config 
                                    svg={<SvgIPI/>} 
                                    title={'IPI'} 
                                    description={'Alíquiota IPI aplicado ao produto:'}
                                    input={
                                        <NumberInput 
                                            placeholder={'______'} 
                                            valor={ipi} 
                                            setValor={handleProdutoChange('ipi')}                                
                                        />
                                    }
                                />
                                <form className={`${style.extra} ${styleProduto.ipi}`} onSubmit={(e) => handleProdutoSubmit('ipi', e, fatorBase)}>
                                    <span> 
                                        <div>
                                            <label htmlFor="">Aliquota IPI</label>
                                            <NumberInput 
                                                placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                                valor={ipiProporcional} 
                                                setValor={handleProdutoChange('ipiProporcional')} 
                                                required
                                            />
                                        </div>        
                                        <p>/</p>
                                        <div>
                                            <label htmlFor="">Fator Base</label>
                                            <NumberInput 
                                                placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                                valor={fatorBase} 
                                                setValor={handleFornecedorChange('fatorBase')} 
                                                required 
                                                disabled
                                            />
                                        </div>
                                    </span>
                                    <button type='submit' hidden></button>                        
                                </form>
                            </div>
                            }
                            {displayControl.unitarioNota&&
                            <Config 
                                svg={<SvgUnitarioNota/>} 
                                title={'Unitário (Nota)'} 
                                description={
                                    `${usaUnitarioPedido
                                        ? 'Unitário Nota para calcular preço 2:'
                                        : 'Unitário para calcular preços:'
                                    }`
                                }
                                input={
                                    <NumberInput 
                                        placeholder={'______'} 
                                        valor={unitarioNota} 
                                        setValor={handleProdutoChange('unitarioNota')}  
                                        required
                                    />
                                }
                            />
                            }
                            {displayControl.unitarioPedido&&
                            <Config 
                                svg={<SvgUnitarioNota/>} 
                                title={'Unitário (Pedido)'} 
                                description={'Valor para calcular preços:'}
                                input={
                                    <NumberInput 
                                        placeholder={'______'} 
                                        valor={unitarioPedido} 
                                        setValor={handleProdutoChange('unitarioPedido')}  
                                        required
                                    />
                                }
                            />
                            }
                            {displayControl.unitarioComposto&&
                            <div className={`${style.configWrapper} ${styleProduto.configWrapper} ${styleProduto.compostoWrapper}`}>
                                <Config 
                                    svg={<SvgComposto/>} 
                                    title={'Unitário (Composto)'} 
                                    description={'Unitário calculado pelo soma de dois valores:'}
                                    input={
                                        <NumberInput 
                                            placeholder={'______'} 
                                            valor={unitarioComposto} 
                                            setValor={handleProdutoChange('unitarioComposto')}
                                            disabled
                                            data-valid={(unitarioComposto) ? true : false}
                                            required
                                        />
                                    }
                                />
                                {/* Adicionar variante que depende se o produto tem ou não ST
                                    -> Sem st (novo TODO): valor x 2
                                    -> Com st (existente): valor1 + valor2 
                                */}
                                <div className={`${style.extra} ${styleProduto.composto}`} 
                                // onSubmit={(e) => handleProdutoSubmit('composto', e, fatorBase)}
                                onKeyDown={(e) => handleKeyDown(e)}
                                >
                                    <span> 
                                        <div>
                                            <label htmlFor="">Valor Frete</label>
                                            <NumberInput 
                                                placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                                valor={composto1} 
                                                setValor={handleProdutoChange('composto1')} 
                                                required
                                            />
                                        </div>        
                                        <p>+</p>
                                        <div>
                                            <label htmlFor="">Fator Frete</label>
                                            <NumberInput 
                                                placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                                valor={composto2} 
                                                setValor={handleProdutoChange('composto2')} 
                                                required
                                            />
                                        </div>
                                    </span>
                                    <button type='submit' hidden></button>                        
                                </div>
                            </div>
                            }
                            <button type="submit" hidden></button>
                            {/* <button className={styleProduto.submit} type="submit" onClick={() => submitForm()}>Adicionar</button> */}
                        </form>
                        {/* </div> */}
                    </div>
                </motion.div>
                }
            </AnimatePresence>
        </div>
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

const SvgST = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M214 311L298 395L214 479" stroke="black" strokeWidth="40"/>
            <path d="M298 189L214 105L298 21" stroke="black" strokeWidth="40"/>
            <path d="M156 105C76 105 12 118.5 115 221.5C218 324.5 76 275.67 76 315.294C76 325.8 78.0692 336.203 82.0896 345.909C86.11 355.615 92.0028 364.434 99.4315 371.862C106.86 379.291 115.679 385.184 125.385 389.204C135.091 393.225 145.494 395.294 156 395.294H270.11" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M354.11 395.294C434.11 395.294 498.11 381.794 395.11 278.794C292.11 175.794 434.11 224.624 434.11 185C434.11 174.494 432.041 164.091 428.02 154.385C424 144.679 418.107 135.86 410.679 128.431C403.25 121.003 394.431 115.11 384.725 111.09C375.019 107.069 364.616 105 354.11 105L240 105" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        </svg>
    )
}
const SvgDesconto = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M411.039 361C411.039 388.614 389.092 411 362.02 411C334.947 411 313 388.614 313 361C313 333.386 334.947 311 362.02 311C389.092 311 411.039 333.386 411.039 361Z" stroke="black" strokeWidth="40"/>
            <path d="M190.961 131C190.961 158.614 168.136 181 139.98 181C111.825 181 89 158.614 89 131C89 103.386 111.825 81 139.98 81C168.136 81 190.961 103.386 190.961 131Z" stroke="black" strokeWidth="40"/>
            <path d="M69 431C249.5 431 69 250.5 249.5 250.5C430 250.5 249.5 61 431 61" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgIPI = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90.7028 148L66 438H131.5H197L172.297 148H131.5H90.7028Z" stroke="black" strokeWidth="40"/>
            <path d="M441.685 320.685C365.914 244.914 362.156 399.378 286.803 324.024C236.834 274.055 220.001 323.494 192.357 340.5" stroke="black" strokeWidth="40"/>
            <path d="M197 439H435V314" stroke="black" strokeWidth="40"/>
            <path d="M129 70.1853C206.332 -7.14683 206.332 147.517 283.664 70.1853C360.996 -7.14683 364.852 151.373 442.613 73.6127" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgUnitarioNota = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M87.8767 246.979C-2.61686 155.99 178.37 155.99 87.8767 65L421.877 65C512.37 155.99 331.383 155.99 421.877 246.979C512.37 337.969 326.871 342.506 417.866 434L83.866 434C-7.12898 342.506 178.37 337.969 87.8767 246.979Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <line x1="160" y1="159" x2="339" y2="159" stroke="black" strokeWidth="40"/>
            <line x1="177" y1="257" x2="356" y2="257" stroke="black" strokeWidth="40"/>
            <line x1="153" y1="351" x2="332" y2="351" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgComposto = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M179 250C179 277.614 156.614 300 129 300C101.386 300 79 277.614 79 250C79 222.386 101.386 200 129 200C156.614 200 179 222.386 179 250Z" stroke="black" strokeWidth="40"/>
            <path d="M420 250C420 277.614 397.614 300 370 300C342.386 300 320 277.614 320 250C320 222.386 342.386 200 370 200C397.614 200 420 222.386 420 250Z" stroke="black" strokeWidth="40"/>
            <path d="M249.589 87C330.688 171.845 168.489 171.008 249.589 255.853C330.688 340.698 168.04 348.685 249.589 434" stroke="black" strokeWidth="40"/>
            <path d="M216.5 83H60C37.9086 83 20 100.909 20 123V376C20 398.091 37.9086 416 60 416H186" stroke="black" strokeWidth="40"/>
            <path d="M307.5 83H440C462.091 83 480 100.909 480 123V376C480 398.091 462.091 416 440 416H282" stroke="black" strokeWidth="40"/>
        </svg>
    )
}