'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import style from '../FornecedorTab/FornecedorTab.module.scss'
import { motion, AnimatePresence } from 'framer-motion'
import Config from '@/app/(app)/configurar/(Config)/Config'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import Converter from '@/utils/typeConversion'
import { useCalcular } from '../../context/CalcularContext'
import { debug } from 'console'

const NUMBER_INPUT_PLACEHOLDER = '_'.repeat(25)

export default function PedidoTab() {

    const [displayPedido, setDisplayPedido] = useState(false)

    // const [fatorBase, setFatorBase] = useState('2')
    const {fornecedorContext, pedidoContext, displayControl} = useCalcular()
    const {fornecedorData: { 
        fatorBase 
    }, handleFornecedorChange} = fornecedorContext 
    const {pedidoData: {
        quantidadeProdutos,
        fatorTransportePedido,
        valorFrete,
        fatorFrete,
        valorTotalProdutos,
        fatorSTPedido,
        valorST,
        multiploST,
        valorTotalProdutosST,
    }, handlePedidoSubmit, handlePedidoChange} = pedidoContext

    // useEffect(() => {
    //     handlePedidoSubmit('transporte', fatorBase)
    // }, [valorFrete, fatorFrete, valorTotalProdutos, fatorBase])
    const {stringToFloat, floatToString} = Converter
    // const fatorTransporteRender = 
    //     (valorFrete !== '' && fatorFrete !== '' && valorTotalProdutos !== '' && fatorBase !== '')
    //     ? floatToString(1 + (
    //         (stringToFloat(valorFrete) * stringToFloat(fatorFrete)) / 
    //         (stringToFloat(valorTotalProdutos) * stringToFloat(fatorBase))
    //     ), 3)
    //     : ''

    return (
        <div className={style.wrap}>
            <span className={style.tab}>
                <span className={style.title}>
                    <SvgUnitarioNota />
                    <h3>Pedido</h3>
                </span>
                <span className={style.selectWrap}>
                    <button 
                        className={`${style.button} ${style.expand}`} 
                        onClick={() => setDisplayPedido(prev => !prev)} 
                    >
                        <svg width="25" height="25" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d={`${displayPedido
                                    ? "M376 314L250 188L124 314" 
                                    : "M376 187L250 313L124 187"
                                }`}  
                                strokeWidth="50"/>
                        </svg>             
                    </button>
                </span>
            </span>
            <AnimatePresence>
                {displayPedido&&
                <motion.div className={style.list}
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                    {/* Implementar render condicional se ambos st e transporte não são usados mostrar mensagem:
                    'O produto atual não utiliza nem transporte nem st'
                     */}
                    {/* {(displayControl.transporte === false && displayControl.st === false)} ? : */}

                    {/* implementar talvez um onSubmit */}
                    <div className={style.fornecedorConfigs}>
                    
                    <Config 
                        svg={<SvgFornecedor/>} 
                        title={'Quantidade Produtos'} 
                        description={'Quantidade de produtos na nota para conferir na tabela'}
                        input={
                            <NumberInput 
                                placeholder={'______'} 
                                valor={quantidadeProdutos} 
                                setValor={handlePedidoChange('quantidadeProdutos')}
                                required
                            />
                        }
                    />
                    {displayControl.fatorTransportePedido&&
                    <div className={style.configWrapper}>
                        <Config 
                            svg={<SvgFornecedor/>} 
                            title={'Fator Transporte'} 
                            description={'Calcula o fator acrescentado devido ao frete'}
                            input={
                                <NumberInput 
                                    placeholder={'______'} 
                                    valor={fatorTransportePedido} 
                                    setValor={handlePedidoChange('fatorTransportePedido')}
                                    required
                                />
                            }
                        />
                        <form className={style.extra} 
                        onSubmit={(e) => handlePedidoSubmit('transporte', e, fatorBase)}
                        >
                            <span> 
                                <div>
                                    <label htmlFor="">Valor Frete</label>
                                    <NumberInput placeholder={NUMBER_INPUT_PLACEHOLDER} valor={valorFrete} setValor={handlePedidoChange('valorFrete')} required/>
                                </div>        
                                <p>x</p>
                                <div>
                                    <label htmlFor="">Fator Frete</label>
                                    <NumberInput placeholder={NUMBER_INPUT_PLACEHOLDER} valor={fatorFrete} setValor={handlePedidoChange('fatorFrete')} required/>
                                </div>
                            </span>
                        /
                            <span>
                                <div>
                                    <label htmlFor="">Total Prod.</label>
                                    <NumberInput placeholder={NUMBER_INPUT_PLACEHOLDER} valor={valorTotalProdutos} setValor={handlePedidoChange('valorTotalProdutos')} required/>
                                </div>
                                <p>x</p>
                                <div>
                                    <label htmlFor="">Fator Base</label>
                                    <NumberInput placeholder={NUMBER_INPUT_PLACEHOLDER} valor={fatorBase} setValor={handleFornecedorChange('fatorBase')} required disabled/>
                                </div>
                            </span>
                            <button type='submit' hidden></button>                        
                        </form>
                    </div>
                    }

                    {displayControl.fatorSTPedido&&
                    <div className={style.configWrapper}>
                        <Config 
                            svg={<SvgST/>} 
                            title={'Fator ST'} 
                            description={'Calcula o fator acrescentado aos produtos com ST'}
                            input={
                                <NumberInput 
                                    placeholder={'______'} 
                                    valor={fatorSTPedido} 
                                    setValor={handlePedidoChange('fatorSTPedido')}
                                    required
                                />
                            }
                        />
                        <form className={style.extra} 
                        onSubmit={(e) => handlePedidoSubmit('st', e, fatorBase)}
                        >
                            <span> 
                                <div>
                                    <label htmlFor="">Valor Total ST</label>
                                    <NumberInput placeholder={NUMBER_INPUT_PLACEHOLDER} valor={valorST} setValor={handlePedidoChange('valorST')} required />
                                </div>        
                                <p>x</p>
                                <div>
                                    <label htmlFor="">Fator ST</label>
                                    <NumberInput placeholder={NUMBER_INPUT_PLACEHOLDER} valor={multiploST} setValor={handlePedidoChange('multiploST')} required />
                                </div>
                            </span>
                        /
                            <span>
                                <div>
                                    <label htmlFor="">Total P. c/ ST</label>
                                    <NumberInput placeholder={NUMBER_INPUT_PLACEHOLDER} valor={valorTotalProdutosST} setValor={handlePedidoChange('valorTotalProdutosST')} required />
                                </div>
                                <p>x</p>
                                <div>
                                    <label htmlFor="">Fator Base</label>
                                    <NumberInput placeholder={NUMBER_INPUT_PLACEHOLDER} valor={fatorBase} setValor={handleFornecedorChange('fatorBase')} required disabled/>
                                </div>
                            </span>                        
                            <button type='submit' hidden></button>
                        </form>
                    </div>
                    }
                    
                    <button type="submit" hidden></button>
                    </div>
                </motion.div>
                }             
            </AnimatePresence>
        </div>
    )

}

const SvgUnitarioNota = () => {
    return (
        <svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M87.8767 246.979C-2.61686 155.99 178.37 155.99 87.8767 65L421.877 65C512.37 155.99 331.383 155.99 421.877 246.979C512.37 337.969 326.871 342.506 417.866 434L83.866 434C-7.12898 342.506 178.37 337.969 87.8767 246.979Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <line x1="160" y1="159" x2="339" y2="159" stroke="black" strokeWidth="40"/>
            <line x1="177" y1="257" x2="356" y2="257" stroke="black" strokeWidth="40"/>
            <line x1="153" y1="351" x2="332" y2="351" stroke="black" strokeWidth="40"/>
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