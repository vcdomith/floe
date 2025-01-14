'use client'

import { FormEvent, KeyboardEvent, RefObject, useEffect, useMemo, useRef, useState } from 'react'
import style from '../FornecedorTab/FornecedorTab.module.scss'
import { motion, AnimatePresence } from 'framer-motion'
import Config from '@/app/(app)/configurar/(Config)/Config'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import { useCalcular, useChave, useManual } from '../../context/CalcularContext'
import CheckBox from '@/app/(app)/configurar/(CheckBox)/CheckBox'
import { IFatoresPedido, IPedidoDisplayControl } from '@/hooks/usePedido'
import usePedidoTabRefs, { InputRefs, Transporte_STRefs } from '@/hooks/usePedidoTabRefs'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'

const NUMBER_INPUT_PLACEHOLDER = '_'.repeat(25)

export default function PedidoTab({ initial = false }: { initial ?: boolean }) {

    const [ displayPedido, setDisplayPedido ] = useState(initial)

    // Receber o contexto a ser usado por prop, permite ser usado em mais de um lugar
    const { context: { context } } = useCalcular()
    // const { manual: { context } } = useManual()
    const { fornecedorContext, pedidoContext } = context
    const {fornecedorData: { 
        fatorBase 
    }, handleFornecedorChange} = fornecedorContext 
    const {
        pedidoData,
        handlePedidoSubmit, 
        handlePedidoChange, 
        getPedidoDisplayControl,
        updatePedidoControl,
        pedidoDiff
    } = pedidoContext
    const {
        usaNcm,
        quantidadeProdutos,
        fatorTransportePedido,
        valorFrete,
        fatorFrete,
        valorTotalProdutos,
        fatorSTPedido,
        valorST,
        multiploST,
        valorTotalProdutosST,
    } = pedidoData

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const pedidoDisplayControl = useMemo(() => getPedidoDisplayControl(context), [context])

    const { refs, pedidoFormRef, transporteRefs, stRefs, assignRef } = usePedidoTabRefs()

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, field: keyof IFatoresPedido) => {

        if (e.key === 'Enter') {

            e.preventDefault()

            let checkedRefs: {} | Transporte_STRefs = {}
            let activeField: ('' | 'transporte' | 'st') = ''

            switch (field) {

                case 'fatorTransportePedido':

                    checkedRefs = {...transporteRefs}
                    activeField = 'transporte'
                    break;

                case 'fatorSTPedido':
                
                    checkedRefs = {...stRefs}
                    activeField = 'st'
                    break;     
                    
            }

            const valid = Object.values(checkedRefs as Transporte_STRefs)
            .filter( (ref: HTMLInputElement) => typeof ref !== 'function')
            .every( (ref: HTMLInputElement) => {
                if(ref.value === '') {
                    ref.focus()
                    return false
                }
                return true
            })

            if (!valid) return 
            if (activeField === '') return

            handlePedidoSubmit(activeField, fatorBase)
            pedidoFormRef.current?.requestSubmit()

        }

    }

    const blurRefs = () => {
        refs.current.fatorTransportePedidoRef?.blur()
        refs.current.fatorStPedidoRef?.blur()
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if(pedidoDiff.length === 0) updatePedidoControl(pedidoData)
        blurRefs()
        setDisplayPedido(false)

    }

    return (
        <div className={style.wrap}>
            <span className={style.tab}>
                <span className={style.title}>
                    {svgsUtil.unitarioNota}
                    <h3>Pedido</h3>
                </span>
                <span className={style.selectWrap}>
                    <button 
                        className={`${style.button} ${style.expand}`} 
                        onClick={(e) => {
                            e.stopPropagation()
                            setDisplayPedido(prev => !prev)
                        }} 
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
                    layoutRoot
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >

                    <form 
                        className={style.fornecedorConfigs}
                        ref={pedidoFormRef}
                        onSubmit={(e) => handleSubmit(e)}
                    >
                    
                    <Config 
                        svg={svgsUtil.ncm} 
                        title={'Usa NCM'} 
                        description={'NCM vai ser cadastrado nesse pedido?'}
                        diff={pedidoDiff.includes('usaNcm')}
                        input={
                            <CheckBox 
                                checked={usaNcm}
                                setChecked={handlePedidoChange('usaNcm')}
                                autoFocus={initial}
                            />
                        }
                    />
                    <Config 
                        svg={svgsUtil.produto} 
                        title={'Quantidade Produtos'} 
                        description={'Quantidade de produtos na nota para conferir na tabela'}
                        diff={pedidoDiff.includes('quantidadeProdutos')}
                        input={
                            <NumberInput 
                                placeholder={'______'} 
                                valor={quantidadeProdutos} 
                                setValor={handlePedidoChange('quantidadeProdutos')}
                                required
                            />
                        }
                    />
                    {pedidoDisplayControl.fatorTransportePedido&&
                    <div className={style.configWrapper}>
                        <Config 
                            svg={svgsUtil.transporte} 
                            title={'Fator Transporte'} 
                            description={'Calcula o fator acrescentado devido ao frete'}
                            diff={pedidoDiff.includes('fatorTransportePedido')}
                            input={
                                <NumberInput 
                                    placeholder={'______'} 
                                    valor={fatorTransportePedido} 
                                    setValor={handlePedidoChange('fatorTransportePedido')}
                                    required
                                    refProp={assignRef('fatorTransportePedidoRef')}
                                />
                            }
                        />
                        <div className={style.extra} 
                        // onSubmit={(e) => handlePedidoSubmit('transporte', e, fatorBase)}
                        onKeyDown={(e) => handleKeyDown(e, 'fatorTransportePedido')}
                        >
                            <span> 
                                <div>
                                    <label htmlFor="">Valor Frete</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={valorFrete} 
                                        setValor={handlePedidoChange('valorFrete')} 
                                        // required
                                        refProp={assignRef('valorFreteRef')}
                                    />
                                </div>        
                                <p>x</p>
                                <div>
                                    <label htmlFor="">Fator Frete</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={fatorFrete} 
                                        setValor={handlePedidoChange('fatorFrete')} 
                                        // required
                                        refProp={assignRef('fatorFreteRef')}
                                    />
                                </div>
                            </span>
                        /
                            <span>
                                <div>
                                    <label htmlFor="">Total Prod.</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={valorTotalProdutos} 
                                        setValor={handlePedidoChange('valorTotalProdutos')} 
                                        // required
                                        refProp={assignRef('valorTotalProdutosRef')}
                                    />
                                </div>
                                <p>x</p>
                                <div>
                                    <label htmlFor="">Fator Base</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={fatorBase} setValor={handleFornecedorChange('fatorBase')} 
                                        required 
                                        disabled
                                    />
                                </div>
                            </span>
                            {/* <button type='submit' hidden></button>                         */}
                        </div>
                    </div>
                    }

                    {pedidoDisplayControl.fatorSTPedido&&
                    <div className={style.configWrapper}>
                        <Config 
                            svg={svgsUtil.st} 
                            title={'Fator ST'} 
                            description={'Calcula o fator acrescentado aos produtos com ST'}
                            diff={pedidoDiff.includes('fatorSTPedido')}
                            input={
                                <NumberInput 
                                    placeholder={'______'} 
                                    valor={fatorSTPedido} 
                                    setValor={handlePedidoChange('fatorSTPedido')}
                                    required
                                    refProp={assignRef('fatorStPedidoRef')}
                                />
                            }
                        />
                        <div className={style.extra} 
                            onKeyDown={(e) => handleKeyDown(e, 'fatorSTPedido')}
                        >
                            <span> 
                                <div>
                                    <label htmlFor="">Valor Total ST</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={valorST} 
                                        setValor={handlePedidoChange('valorST')} 
                                        // required 
                                        refProp={assignRef('valorSTRef')}
                                    />
                                </div>        
                                <p>x</p>
                                <div>
                                    <label htmlFor="">Fator ST</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={multiploST} 
                                        setValor={handlePedidoChange('multiploST')} 
                                        // required 
                                        refProp={assignRef('multiploSTRef')}
                                    />
                                </div>
                            </span>
                        /
                            <span>
                                <div>
                                    <label htmlFor="">Total P. c/ ST</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={valorTotalProdutosST} 
                                        setValor={handlePedidoChange('valorTotalProdutosST')} 
                                        // required 
                                        refProp={assignRef('valorTotalProdutosSTRef')}
                                    />
                                </div>
                                <p>x</p>
                                <div>
                                    <label htmlFor="">Fator Base</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={fatorBase} 
                                        setValor={handleFornecedorChange('fatorBase')} 
                                        // required 
                                        disabled
                                    />
                                </div>
                            </span>                        
                            {/* <button type='submit' hidden></button> */}
                        </div>
                    </div>
                    }
                    
                    <button type="submit" hidden></button>
                    </form>
                </motion.div>
                }             
            </AnimatePresence>
        </div>
    )

}