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

        setLoadingFornecedor(true)
        const supabase = dbConnect()
        const { data: fornecedorDB, error } = await supabase
            .from('fornecedores')
            .select('*')
            .eq('nome', fornecedor.toLowerCase())
        setFornecedorDb(fornecedorDB![0] as IFornecedor)
        setLoadingFornecedor(false)
        console.log(fornecedorDB);

    }

    return (
        <div className={style.wrap}>
        <span className={style.tab} data-display={displayFornecedor}>
            <span className={style.title}>
                {svg || <SvgFornecedor />}
                <h3>{ titulo ? titulo : 'Fornecedor'}</h3>
            </span>
            <span className={style.selectWrap}>
                <SelectFornecedor 
                    fornecedoresControle={fornecedores}
                    fornecedor={fornecedor}
                    setFornecedor={setCapitalizedFornecedor}
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
                        <path d="M129 437L129 201L212 201" stroke="black" stroke-width="40" stroke-linejoin="round"/>
                        <path d="M211 355L129.5 437L48 355" stroke="black" stroke-width="40"/>
                        <ellipse cx="352" cy="87" rx="93" ry="40" stroke="black" stroke-width="40"/>
                        <path d="M445 306C445 323.673 403.362 338 352 338C300.638 338 259 323.673 259 306" stroke="black" stroke-width="40"/>
                        <path d="M445 200C445 217.121 403.362 231 352 231C300.638 231 259 217.121 259 200" stroke="black" stroke-width="40"/>
                        <path d="M259 310V84M445 306.904V84" stroke="black" stroke-width="40"/>
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
                            stroke-width="50"/>
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
                    svg={<SvgComposto/>} 
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
                    svg={<SvgComposto/>} 
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
                    svg={<SvgComposto/>} 
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
                    svg={<SvgFornecedor/>} 
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
                    svg={<SvgST/>} 
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
                    svg={<SvgPercent/>} 
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
                    svg={<SvgIPI/>} 
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
                    svg={<SvgUnitarioNota/>} 
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
                    svg={<SvgComposto/>} 
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
const SvgPercent = () => {
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