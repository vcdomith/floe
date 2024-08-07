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
import { svgsUtil } from "@/components/SvgArray/SvgUtil"

const NUMBER_INPUT_PLACEHOLDER = '_'.repeat(50)

export default function ProdutoTab() {

    const {produtoContext, fornecedorContext, produtoIsValid, submitForm, displayControl} = useCalcular()
    const {produtoData: {
        st,
        codigo,
        ncm,
        desconto,
        ipi,
        ipiProporcional,
        unitarioNota,
        unitarioPedido,
        unitarioComposto,
        composto1,
        composto2,
    }, setProdutoData, handleProdutoChange, handleProdutoSubmit, resetForm, codigoInputRef} = produtoContext
    const {fornecedorData: { fatorBase, usaUnitarioPedido }, handleFornecedorChange} = fornecedorContext

    const [displayProdutoTab, setDisplayProdutoTab] = useState(false)

    const compostoRef_1 = useRef<HTMLInputElement>(null)
    const compostoRef_2 = useRef<HTMLInputElement>(null)
    
    // const [produtoComST, setProdutoComST] = useState(false)
    // const [codigoProduto, setCodigoProduto] = useState('')
    // const [desconto, setDesconto] = useState('')

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        produtoIsValid&& submitForm()
    }

    const {stringToFloat, floatToString} = Converter
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, field: keyof IProdutoContext) => {

        if(e.key === 'Enter') {
            
            const calculoUnitario: string = floatToString(stringToFloat(composto1) + stringToFloat(composto2))

            if (calculoUnitario === 'NaN' && field === 'unitarioComposto') {

                e.preventDefault()

                if (composto1 === '') {

                    compostoRef_1.current?.focus()
                    return

                } 

                if (composto2 === '') {

                    compostoRef_2.current?.focus()
                    return

                }

            }

            const valorCalculado = (field === 'unitarioComposto')
                ? floatToString(stringToFloat(composto1) + stringToFloat(composto2), 2)
                : floatToString(stringToFloat(ipiProporcional) / stringToFloat(fatorBase))

            setProdutoData(prev => ({...prev, [field]: valorCalculado}))
            if (valorCalculado === 'NaN') e.preventDefault()
        } 

    }

    return (
        <div className={style.wrap}>
            <span className={style.tab}>
                <span className={style.title}>
                    {svgsUtil.produto}
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
                                svg={svgsUtil.st} 
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
                                svg={svgsUtil.codigo} 
                                title={'Código'} 
                                description={'Código do produto'}
                                input={
                                    <input
                                        className={style.codigo}
                                        ref={codigoInputRef}
                                        type="text" 
                                        placeholder="_____________"
                                        value={codigo}
                                        onChange={(e) => handleProdutoChange('codigo')(e.target.value.toUpperCase())}
                                        required
                                    />
                                }
                            />
                            {displayControl.ncm&&
                            <Config 
                                svg={svgsUtil.ncm} 
                                title={'NCM'} 
                                description={'Código do NCM'}
                                input={
                                    <input
                                        className={style.codigo}
                                        type="text" 
                                        placeholder="_____________"
                                        value={ncm}
                                        onChange={(e) => handleProdutoChange('ncm')(e.target.value.toUpperCase())}
                                        required
                                        minLength={8}
                                        maxLength={8}
                                    />
                                }
                            />
                            }        
                            {displayControl.desconto&&
                            <Config 
                                svg={svgsUtil.desconto} 
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
                            {displayControl.ipi&&
                            <div className={`${style.configWrapper} ${styleProduto.configWrapper}`}>
                                <Config 
                                    svg={svgsUtil.ipi} 
                                    title={'IPI'} 
                                    description={'Alíquiota IPI aplicado ao produto:'}
                                    input={
                                        <NumberInput 
                                            placeholder={'______'} 
                                            valor={ipi} 
                                            setValor={handleProdutoChange('ipi')}
                                            required                  
                                        />
                                    }
                                />
                                <div 
                                    className={`${style.extra} ${styleProduto.ipi}`} 
                                    // onSubmit={(e) => handleProdutoSubmit('ipi', e, fatorBase)}
                                    onKeyDown={(e) => handleKeyDown(e, 'ipi')}
                                >
                                    <span> 
                                        <div>
                                            <label htmlFor="">Aliquota IPI</label>
                                            <NumberInput 
                                                placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                                valor={ipiProporcional} 
                                                setValor={handleProdutoChange('ipiProporcional')} 
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
                                </div>
                            </div>
                            }
                            {displayControl.unitarioNota&&
                            <Config 
                                svg={svgsUtil.unitarioNota} 
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
                                svg={svgsUtil.unitarioNota} 
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
                                    svg={svgsUtil.composto} 
                                    title={'Unitário (Composto)'} 
                                    description={'Unitário calculado pela soma de dois valores:'}
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
                                onKeyDown={(e) => handleKeyDown(e, 'unitarioComposto')}
                                >
                                    <span> 
                                        <div>
                                            <label htmlFor="">Composto 1</label>
                                            <NumberInput 
                                                placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                                valor={composto1} 
                                                setValor={handleProdutoChange('composto1')} 
                                                required
                                                refProp={compostoRef_1}
                                            />
                                        </div>        
                                        <p>+</p>
                                        <div>
                                            <label htmlFor="">Composto 2</label>
                                            <NumberInput 
                                                placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                                valor={composto2} 
                                                setValor={handleProdutoChange('composto2')} 
                                                required
                                                refProp={compostoRef_2}
                                            />
                                        </div>
                                    </span>
                                    <button type='submit' hidden></button>                        
                                </div>
                            </div>
                            }
                            <button type="submit" hidden></button>
                        </form>
                    </div>
                </motion.div>
                }
            </AnimatePresence>
        </div>
    )

}