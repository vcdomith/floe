'use client'

import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import capitalizeInner from "@/utils/capitalize";
import { useEffect, useState } from "react";

import style from './FornecedorTab.module.scss'
import { motion, AnimatePresence } from "framer-motion";
import Config from "@/app/(app)/configurar/(Config)/Config";
import CheckBox from "@/app/(app)/configurar/(CheckBox)/CheckBox";
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput";
import { dbConnect } from "@/utils/db/supabase";
import { IFornecedor } from "@/interfaces/IFornecedor";
import LogoSvg from "@/components/SvgArray/LogoSvg";
import useFornecedor from "@/hooks/useFornecedor";
import { useCalcular, useManual } from "../../context/CalcularContext";
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import { useModal } from "@/app/(app)/(contexts)/ModalContext";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";

interface FornecedorTabProps {

    disabled?: boolean

    fornecedorCtx: string
    fornecedores: string[]
    svg?: React.ReactNode
    titulo?: string

}

export type FornecedorQueryType = keyof IFornecedor

export default function FornecedorTab({ 
    disabled = false,
    fornecedores, 
    svg, 
    titulo 
}: FornecedorTabProps) {

    const [displayFornecedor, setDisplayFornecedor] = useState(false)

    const [loadingFornecedor, setLoadingFornecedor] = useState(false)

    const { context: { context } } = useCalcular()

    const { 
        fornecedorContext,
        tabelaContext: { tabela }, 
        resetContext
    } = context

    const {fornecedorData, setFornecedorData, handleFornecedorChange, fornecedorControl, fornecedorDiff, updateFornecedorControl} = fornecedorContext

    const {
        nome,
        fatorBase,
        fatorBaseNormal,
        fatorBaseST,
        usaTransporte,
        usaSt,
        usaDesconto,
        usaIpi,
        usaIpiProporcional,
        usaUnitarioPedido,
        usaComposto
    } = fornecedorData

    const {setModal, clearModal} = useModal()

    const getFornecedorDataDB = async () => {

        if (fornecedorControl !== undefined && !fornecedorDiff.includes('nome')) {
            console.log('fornecedor já carregado!');
            return
        }

        setLoadingFornecedor(true)

        try {
            
            const type: FornecedorQueryType = 'nome'

            const res = await fetch(
                `/calcular/api/getFornecedor?type=${type}&nome=${nome.toLowerCase()}`
            )
            const fornecedorDB: IFornecedor = await res.json()
            
            setLoadingFornecedor(false)
            setFornecedorData(fornecedorDB)
            updateFornecedorControl(fornecedorDB)

        } catch (error) {
            
            console.log(error);
            setLoadingFornecedor(false)

        }

        setLoadingFornecedor(false)

    }

    const handleFornecedorConfirm = () => {

        if (
            fornecedorDiff.includes('nome') &&
            tabela.length > 0
        ) {
            setModal(
                <ConfirmationDialog 
                    title={"Confirme a troca de Fornecedor:"} 
                    message={"Aviso: Ao confirmar a troca todos produtos serão apagados!"}
                    cancelHandler={clearModal} 
                    confirmHandler={() => {
                        resetContext()
                        getFornecedorDataDB()
                    }} 
                />
            )
            return
        }

        getFornecedorDataDB()

    }

    return (
        <div className={style.wrap}>
        <span className={style.tab} data-display={displayFornecedor}>
            <span className={style.title}>
                {svg || svgsUtil.transporte}
                <h3>{ titulo ? titulo : 'Fornecedor'}</h3>
            </span>
            <span className={`${style.selectWrap} ${style.w100}`}>
                <SelectFornecedor
                    disabled={disabled}
                    fornecedoresControle={fornecedores}
                    fornecedor={nome}
                    setFornecedor={handleFornecedorChange('nome')}
                    confirmFornecedor={getFornecedorDataDB}
                />
                {(fornecedorControl === undefined || fornecedorDiff.includes('nome'))
                ?
                <button 
                    className={style.button} 
                    onClick={() => handleFornecedorConfirm()}
                    disabled={nome === '' ? true : false}>
                    {loadingFornecedor
                    ?
                        <LogoSvg loop />
                    :
                        svgsUtil.import
                    }
                </button> 
                :
                <button 
                    className={`${style.button} ${style.expand}`} 
                    onClick={() => setDisplayFornecedor(prev => !prev)} 
                >
                    <svg width="25" height="25" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d={`${displayFornecedor
                                ? "M376 314L250 188L124 314" 
                                : "M376 187L250 313L124 187"
                            }`}  
                            strokeWidth="50"/>
                    </svg>
                </button>
                }
            </span>
        </span>
        <AnimatePresence>
            {displayFornecedor&&
            <motion.div className={style.list}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
            >
            <motion.div className={style.fornecedorConfigs}>
                <Config 
                    svg={svgsUtil.base} 
                    title={'Fator Base'} 
                    description={'Fator Base que todos produtos do fornecedor usam'} 
                    diff={fornecedorDiff.includes('fatorBase')}
                    input={
                        <NumberInput 
                            placeholder={"x1,0"} 
                            valor={fatorBase} 
                            setValor={handleFornecedorChange('fatorBase')} 
                        />
                    }                               
                />
                <Config 
                    svg={svgsUtil.fatorBaseNormal} 
                    title={'Fator Normal'} 
                    description={'Fator que os produtos sem ST usam'} 
                    diff={fornecedorDiff.includes('fatorBaseNormal')}
                    input={
                        <NumberInput 
                            placeholder={"x1,0"} 
                            valor={fatorBaseNormal} 
                            setValor={handleFornecedorChange('fatorBaseNormal')} 
                        />
                    }                              
                />
                <Config 
                    svg={svgsUtil.fatorBaseST} 
                    title={'Fator ST'} 
                    description={'Fator que os produtos com ST usam'}
                    diff={fornecedorDiff.includes('fatorBaseST')}
                    input={
                        <NumberInput 
                            placeholder={"x1,0"} 
                            valor={fatorBaseST} 
                            setValor={handleFornecedorChange('fatorBaseST')} 
                        />
                    }                             
                />
                <Config 
                    svg={svgsUtil.transporte} 
                    title={'Transporte'} 
                    description={'Usa transporte no calculo?'} 
                    diff={fornecedorDiff.includes('usaTransporte')}
                    input={
                        <CheckBox
                            checked={usaTransporte} 
                            setChecked={handleFornecedorChange('usaTransporte')} 
                        />
                    }                           
                />
                <Config 
                    svg={svgsUtil.st} 
                    title={'ST'} 
                    description={'Usa ST no calculo?'} 
                    diff={fornecedorDiff.includes('usaSt')}
                    input={
                        <CheckBox 
                            checked={usaSt} 
                            setChecked={handleFornecedorChange('usaSt')} 
                        />
                    }                              
                />
                <Config 
                    svg={svgsUtil.desconto} 
                    title={'Desconto'} 
                    description={'Usa desconto no calculo?'} 
                    diff={fornecedorDiff.includes('usaDesconto')}
                    input={
                        <CheckBox 
                            checked={usaDesconto} 
                            setChecked={handleFornecedorChange('usaDesconto')} 
                        />
                    }                               
                />
                <Config 
                    svg={svgsUtil.ipi} 
                    title={'IPI'} 
                    description={'Usa IPI no calculo?'} 
                    diff={fornecedorDiff.includes('usaIpi')}
                    input={
                        <CheckBox 
                            checked={usaIpi} 
                            setChecked={handleFornecedorChange('usaIpi')} 
                        />
                    }                             
                />
                <Config 
                    subConfig
                    svg={svgsUtil.ipi} 
                    title={'IPI Proporcional'} 
                    description={'Usa IPI proporcional ao fator base no calculo dos produtos?'} 
                    diff={fornecedorDiff.includes('usaIpiProporcional')}
                    input={
                        <CheckBox 
                            checked={usaIpiProporcional} 
                            setChecked={handleFornecedorChange('usaIpiProporcional')}
                            disabled={!usaIpi} 
                        />
                    }                             
                />
                <Config 
                    svg={svgsUtil.unitarioNota} 
                    title={'Unitário Pedido'} 
                    description={'Usa unitário do pedido no calculo?'} 
                    diff={fornecedorDiff.includes('usaUnitarioPedido')}
                    input={
                        <CheckBox 
                            checked={usaUnitarioPedido} 
                            setChecked={handleFornecedorChange('usaUnitarioPedido')} 
                        />
                    }                                
                />
                <Config
                    subConfig 
                    svg={svgsUtil.composto} 
                    title={'Composto'} 
                    description={'Usa unitário composto no pedido?'} 
                    diff={fornecedorDiff.includes('usaComposto')}
                    input={
                        <CheckBox
                            checked={usaComposto} 
                            setChecked={handleFornecedorChange('usaComposto')}
                            disabled={!usaUnitarioPedido}
                        />
                    }                              
                />
            </motion.div>
            </motion.div>
            }
        </AnimatePresence>
        </div>
    )

}