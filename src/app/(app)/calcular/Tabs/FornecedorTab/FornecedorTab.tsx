'use client'

import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import capitalize from "@/utils/capitalize";
import { useEffect, useRef, useState } from "react";

import style from './FornecedorTab.module.scss'
import { motion, AnimatePresence } from "framer-motion";
import Config from "@/app/(app)/configurar/(Config)/Config";
import CheckBox from "@/app/(app)/configurar/(CheckBox)/CheckBox";
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput";
import { dbConnect } from "@/utils/db/supabase";
import { IFornecedor } from "@/interfaces/IFornecedor";
import LogoSvg from "@/components/SvgArray/LogoSvg";
import useFornecedor from "@/hooks/useFornecedor";
import { useCalcular } from "../../context/CalcularContext";
import { svgsUtil } from "@/components/SvgArray/SvgUtil";

interface FornecedorTabProps {

    fornecedores: string[]
    svg?: React.ReactNode
    titulo?: string

}

export default function FornecedorTab({ fornecedores, svg, titulo }: FornecedorTabProps) {

    const [fornecedor, setFornecedor] = useState('')
    const setCapitalizedFornecedor = (value: string) => {
        setFornecedor(capitalize(value))
    }
    const [displayFornecedor, setDisplayFornecedor] = useState(false)

    const [fornecedorDb, setFornecedorDb] = useState<IFornecedor>()
    const [loadingFornecedor, setLoadingFornecedor] = useState(false)

    const { fornecedorContext } = useCalcular()
    const {fornecedorData: {
        nome,
        fatorBase,
        fatorBaseNormal,
        fatorBaseST,
        usaTransporte,
        usaSt,
        usaDesconto,
        usaIpi,
        usaUnitarioPedido,
        usaComposto
    }, setFornecedorData, handleFornecedorChange} = fornecedorContext

    useEffect(() => {
        if(fornecedorDb !== undefined) 
            // setDadosFornecedorDb(fornecedorDb)
            setFornecedorData({...fornecedorDb})
    }, [fornecedorDb])

    const getFornecedorDataDB = async () => {

        if (fornecedorDb && fornecedor.toLowerCase() === fornecedorDb.nome) {
            console.log('fornecedor já carregado!');
            return
        }

        setLoadingFornecedor(true)
        const supabase = dbConnect()
        const { data: fornecedorDB, error } = await supabase
            .from('fornecedores')
            .select('*')
            .eq('nome', fornecedor.toLowerCase())

        setFornecedorDb(fornecedorDB![0] as IFornecedor)
        setLoadingFornecedor(false)
        // console.log(fornecedorDB);

    }

    return (
        <div className={style.wrap}>
        <span className={style.tab} data-display={displayFornecedor}>
            <span className={style.title}>
                {svg || svgsUtil.transporte}
                <h3>{ titulo ? titulo : 'Fornecedor'}</h3>
            </span>
            <span className={style.selectWrap}>
                <SelectFornecedor 
                    fornecedoresControle={fornecedores}
                    fornecedor={fornecedor}
                    setFornecedor={setCapitalizedFornecedor}
                    confirmFornecedor={getFornecedorDataDB}
                />
                {(fornecedorDb === undefined || nome !== fornecedor.toLowerCase())
                ?
                <button 
                    className={style.button} 
                    // onClick={() => setDisplay(prev => !prev)} 
                    onClick={() => getFornecedorDataDB()}
                    disabled={fornecedor === '' ? true : false}>
                    {loadingFornecedor
                    ?
                        <LogoSvg loop />
                    :
                        <svg width="25" height="25" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M129 437L129 201L212 201" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
                        <path d="M211 355L129.5 437L48 355" stroke="black" strokeWidth="40"/>
                        <ellipse cx="352" cy="87" rx="93" ry="40" stroke="black" strokeWidth="40"/>
                        <path d="M445 306C445 323.673 403.362 338 352 338C300.638 338 259 323.673 259 306" stroke="black" strokeWidth="40"/>
                        <path d="M445 200C445 217.121 403.362 231 352 231C300.638 231 259 217.121 259 200" stroke="black" strokeWidth="40"/>
                        <path d="M259 310V84M445 306.904V84" stroke="black" strokeWidth="40"/>
                        </svg>
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
            <div className={style.fornecedorConfigs}>
                {/* {fornecedores.map( fornecedor => 
                    <li key={fornecedor}>
                        {fornecedor}
                    </li>
                )} */}
                <Config 
                    svg={svgsUtil.base} 
                    title={'Fator Base'} 
                    description={'Fator Base que todos produtos do fornecedor usam'} 
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
                    input={
                        <CheckBox 
                            checked={usaIpi} 
                            setChecked={handleFornecedorChange('usaIpi')} 
                        />
                    }                             
                />
                {/* {ipi&&
                <Config 
                    svg={<SvgIPI/>} 
                    title={'IPI Proporcional'} 
                    description={'Usa IPI proporcional ao fator base?'}
                    input={
                        <CheckBox 
                            checked={ipi} 
                            setChecked={handleFornecedorChange('ipi')}
                        />
                    }
                />
                } */}
                <Config 
                    svg={svgsUtil.unitarioNota} 
                    title={'Unitário Pedido'} 
                    description={'Usa unitário do pedido no calculo?'} 
                    input={
                        <CheckBox 
                            checked={usaUnitarioPedido} 
                            setChecked={handleFornecedorChange('usaUnitarioPedido')} 
                        />
                    }                                
                />
                <Config 
                    svg={svgsUtil.composto} 
                    title={'Composto'} 
                    description={'Usa unitário composto no pedido?'} 
                    input={
                        <CheckBox 
                            checked={usaComposto} 
                            setChecked={handleFornecedorChange('usaComposto')}
                            disabled={!usaUnitarioPedido} 
                        />
                    }                              
                />
            </div>
            </motion.div>
            }
        </AnimatePresence>
        </div>
    )

}