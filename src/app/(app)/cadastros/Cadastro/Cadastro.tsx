'use client'

import { ICadastro } from "@/interfaces/ICadastro"
import { IProduto } from "@/interfaces/IProduto"
import { IValores } from "@/interfaces/IValores"
import Converter from "@/utils/typeConversion"
import { table } from "console"
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react"

import '@/components/Table/TableBody/TableBody.scss'

import style from './Cadastro.module.scss'
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import Search from "@/components/Search/Search"
import { IFatores } from "@/interfaces/IFatores"
import { IFator } from "@/interfaces/IFator"
import { AnimatePresence, motion } from "framer-motion"

interface CadastroProps {
    cadastro: ICadastro
}

const Cadastro = ({ cadastro }: CadastroProps) => {

    const [display, setDisplay] = useState(false)

    const [pattern, setPattern] = useState("M0 377C78.5 377 123.995 199 246.5 199C359.5 199 130.5 199 261.5 199C384.577 199 402.5 376.5 500 376.5")

    const controleProdutos = cadastro.produtos
    const dateTime = new Date(cadastro.created_at).toLocaleString().split(',')

    const [ref, setRef] = useState<HTMLDivElement | null>(null)
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })
    const [fatores, setFatores] = useState<IFatores | null>(cadastro.produtos[1].fatores)

    // States that renders table values
    const [produtos, setProdutos] = useState(cadastro.produtos)
    const resetProdutos = () => setProdutos(controleProdutos)
    const [busca, setBusca] = useState('')

    useEffect(() => {

        if (show) setShow(false)

        if (busca.length > 0) {
            
            const searchedList = controleProdutos.filter(produto => produto.unitario.includes(busca))
            console.log(searchedList);
            setProdutos(searchedList)

        } else {

            resetProdutos()

        }
            
    }, [busca])

    useEffect(() => {
        setBusca('')
        setFatores(null)
        setCoordinates({ x: 0, y: 0 })
    }, [display])

    const { id, created_at } = cadastro

    // useEffect(() => {

    //     // const paths = [
    //     // `M0 276C78.5 276 123.995 454 246.5 454C359.5 454 130.5 454 261.5 454C384.577 454 402.5 276.5 500 276.5`,
    //     // "M0 377C78.5 377 123.995 199 246.5 199C359.5 199 130.5 199 261.5 199C384.577 199 402.5 376.5 500 376.5"
    //     // ]

    //     const paths = [
    //         "M0 161C78.5 161 123.995 339 246.5 339C359.5 339 130.5 339 261.5 339C384.577 339 402.5 161.5 500 161.5",
    //         "M0 339C78.5 339 123.995 161 246.5 161C359.5 161 130.5 161 261.5 161C384.577 161 402.5 338.5 500 338.5"
    //     ]
    //     // const paths = [
    //     //     "M178.5 250C65 250 62.5 275.5 0 275.5V500H500V275.5C437.5 275.5 292 250 178.5 250Z",
    //     //     "M340 147C226.5 147 62.5 202.015 0 202.015V500H500V202.015C476.5 202.015 453.5 147 340 147Z"
    //     //   ]

    //     const intervalId = setInterval(() => {

    //         setPattern(prev => {
    //             if (paths[0] === prev) {

    //             return paths[1]
    //             } 

    //             return paths[0]
    //         })

    //     }, 15000/produtos.length)

    //     return () => clearInterval(intervalId)

    // }, [produtos.length])

    // const formatValor = (valor: string): string => {

    //     if (valor === ',') return '0,0'
    
    //     const valorFloat = stringToFloat(valor)
    //     const fracional = valorFloat % 1 !== 0
    //     const leadingComma = valor.startsWith(',')
    //     const trailingComma = valor.endsWith(',')
    
    //     const valorFormatado = fracional
    //       ? leadingComma ? '0' + valor : valor
    //       : trailingComma ? valor + '00' : valor + ',00' 
    
    //     return valorFormatado 
    
    // }

    const format = (string: string) => {

        const newString = string.replace(',', '.')
        return parseFloat(newString)

    }

    const origemLookupTable: IFatores = {
        padrao: 'Padrão',
        st: 'ST',
        transporte: 'Transp.',
        fator: 'Fator',
        ipi: 'IPI'
    }

    // const lengthString = `cor-${produtos.length}`
    const lengthStep = Math.floor(produtos.length / 10)

    const [show, setShow] = useState(false)

    return (
        <>
        <AnimatePresence>
        {fatores&&
            <motion.div
                //framer.motion
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}

                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'center',
                    top: 0,
                    left: 0,
                    transform: `translate(${coordinates.x - 32}px, ${coordinates.y - 122}px)`,
                    position: 'absolute',
                    zIndex: 3,
                    backgroundColor: '#e8d4b0',
                    border: '2px solid',
                    borderRadius: '1rem',
                    borderTopLeftRadius: 0,
                    boxShadow: '2px 2px 15px rgba(33, 15, 48, 0.3)' 
                    // overflow: 'hidden'
                }}
                ref={(element) => {
                    if(element) setRef(element)
                }}
            >
                {Object.entries(fatores).map( ([origem, fator], index) => 
                    <span 
                        key={origem}
                        style={{
                            display: 'flex',
                            position: 'relative',
                            padding: '0 0.5rem',
                            gap: '0.5rem',
                            height: '100%',
                            // overflow: 'hidden' 
                            // width: '200px'
                        }}
                    >   
                        {(index === 0)&&
                        <svg 
                        style={{ position: 'absolute', top: 0, left: -32}}
                        fill='#210f30' width="25px" height="25px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z"/></svg>
                        }
                        <p 
                        style={{ 
                            margin: 0, 
                            padding: '0.5rem', 
                            display: "flex", 
                            // flex: 1, 
                            borderRight: '2px solid', 
                            height: '100%',
                            width: '75px',
                            overflow: 'hidden'
                            }}
                        >{origemLookupTable[origem as keyof IFatores]}</p>
                        <p style={{ 
                            margin: 0, 
                            padding: '0.5rem', 
                            display: "flex", 
                            // flex: 1, 
                            height: '100%',
                            width: '75px',
                        }}>
                            {format(fator).toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4})}
                        </p>
                    </span>)}
            </motion.div>    
        }
        </AnimatePresence>
        <span 
            className={display ? `${style.wrapper} ${style.active}` : style.wrapper }
        >
            <div><strong style={{ fontSize: '1.1rem', fontWeight: 600 }}>{id}</strong></div>
            <div><strong>{dateTime[0]}</strong> <span style={{ fontWeight: 400, fontSize: '0.8rem', display: 'flex', flexDirection: 'column'}}>as {dateTime[1].slice(1,)}h</span></div>
            <div><strong>Denlex</strong></div>
            <div style={{ fontWeight: 400, fontSize: '0.8rem' }}>{`${(cadastro.produtos.length).toLocaleString('pt-br', { minimumIntegerDigits: 2 })} produtos`}</div>
            <AnimatePresence>
            {!display
            ?
            // ''
            <motion.svg 
                //framer.motion
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}


            className={style.scroll}
            style={{ transition: `d ${1000/produtos.length}ms`}}
            // onMouseEnter={() => setPattern("M0 199C78.5 199 238.5 269 238.5 377C238.5 485 259 487 259 377C259 267 402.5 199.5 500 199.5")}
            // onMouseLeave={() => setPattern("M0 276C78.5 276 123.995 454 246.5 454C359.5 454 130.5 454 261.5 454C384.577 454 402.5 276.5 500 276.5")}
            >
                <defs>
                <pattern id={`pattern${id}`} patternUnits="userSpaceOnUse" x={0} y={0} width='50' height="50">
                <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={pattern} className={style[`cor-${lengthStep}`]} style={{ transition: `d ${20000/produtos.length}ms`}} stroke="black" strokeWidth='40'/>
                </svg>
                <rect width='100%' height='100%' fill={`url(#pattern${id})`}/>
                </pattern>
                </defs>
                <rect width='100%' height='100%' fill={`url(#pattern${id})`}/>
            </motion.svg>
            :
            <motion.span
                //framer.motion
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}

                className={style.scroll}
            >
                <Search
                    className={style.search}
                    searchParam={busca}
                    setSearchParam={setBusca}
                />    
            </motion.span>
            }
            </AnimatePresence>
            {/* {produtos.map(({ id, unitario, fatores }: IProduto) => 
                <td key={id}>
                    <p>{unitario}</p>
                </td>   
            )} */}
            <button
                onClick={() => setDisplay(prev => !prev)}
            >
                <svg fill="#000000" width="30px"viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d={`${display 
                            ? "M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"
                            : "M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"
                        }`}
                    />
                </svg>
            </button>
        </span>
        <div 
            className={`tbody ${display ? 'active' : ''}`} 
            style={{
                height: `${display 
                            ? produtos.length > 0 
                                ? produtos.length*42 
                                : 100
                            : 0}px`,
                transition: `
                    height ${(produtos.length > 10) ? 1000 : 500}ms ease-in-out, 
                    border ${(produtos.length > 10) ? 1000 : 500}ms ease-in-out
                `,
                fontSize: '1rem',
                // transition: 'height 1000ms ease-out',
                overflow: "hidden",
                borderBottom: `${display ? '2px solid' : '0px solid'}`,
            }}
        >  
        {produtos.length > 0
        ?
        produtos.map((produto, index) => 
        
            <Produto
                key={id*index} 
                produto={produto}
                setCoordinates={setCoordinates}
                setFatores={setFatores} 
            />    
        )
        :
        <div
            className={style.notFound}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onClick={() => {
                setShow(false)
                setBusca('')
            }}
            style={{ 
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center'
            }}
        >
            <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 150.278 180.487 198.278 211.82" stroke="#591C4A" strokeWidth="40" stroke-dasharray="40 20"/>
            <path d="M474.07 98.893C465.57 92.393 350.07 7.89299 305.57 43.893C261.07 79.893 498.57 212.393 474.07 298.893C454.47 368.093 353.57 322.726 305.57 291.393" stroke="#591C4A" strokeWidth="40" stroke-dasharray="40 20"/>
            <circle style={{ zIndex: 1 }} cx="250" cy="250" r="200" fill="url(#paint0_radial_3_31)"/>
            <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
            <defs>
            <radialGradient id="paint0_radial_3_31" cx="0" cy="0" r="1.2" gradientUnits="userSpaceOnUse" gradientTransform="translate(249.799 250.5) rotate(126.557) scale(157.482)">
            <stop stopColor="#E8D4B0" stopOpacity="0"/>
            <stop offset="0.4359" stopColor="#E8D4B0" stopOpacity="0"/>
            <stop offset="0.436" stopColor="#E8D4B0"/>
            <stop offset="1" stopColor="#E8D4B0" stopOpacity="0"/>
            </radialGradient>
        </defs>
            </svg>  
            <p style={{ width: '150px' , transition: 'width 600ms ease'}}>{`${show ? 'Clique para limpar a busca' : 'Nenhum produto encontrado!'}`}</p>       
        </div>
        }
        
        </div>
        </>
    )

    // return(
    
    //     <div 
    //         className='tbody' 
    //         style={{
    //             height: `${55.2}px`,
    //             transition: `height ${400}ms ease-out`
    //         }}
    //     >  
    //         {produtos.map(({ id }, index) => 
            
    //             <div  
    //                 className={`tr`}
    //                 key={(index*3.1415)}
    //             >
    //                 {getTabelas(index).map((valor: string | number, index: number) => 
    //                     <div 
    //                         className='td'
    //                         key={index}
    //                     >{
    //                         (typeof valor === 'number')
    //                         ? valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4})
    //                         : valor
    //                     }
    //                     </div>
    //                 )}
            
    
                    
    //             </div>
    //         )
    //     }
    //     </div>
    //   )

}

export default Cadastro

interface ProdutoProps {

    produto: IProduto
    setCoordinates: ({ x, y }: { x: number, y: number }) => void
    setFatores: (fatores: (IFatores | null)) => void

}

const Produto = ({ produto, setCoordinates, setFatores }: ProdutoProps ) => {

    const { stringToFloat } = Converter
    const { id, unitario, fatores } = produto

    function calcularTabela(valor: number, args: number[]): number {

        return customRound(args.reduce((acc, atual) => acc * atual, valor))
    
    }

    function customRound(value: number): number {
        const floorValue = Math.floor(value);
        const halfFloorValue = floorValue + 0.5;
        const nextFloorValue = floorValue + 1;
      
        const diffToFloor = Math.abs(value - floorValue);
        const diffToHalfFloor = Math.abs(value - halfFloorValue);
        const diffToNextFloor = Math.abs(value - nextFloorValue);
    
        // Variable to log for checking the rounding/calculations
        let a = {
          value: value,
          floor: floorValue, 
          halfFloor: halfFloorValue,
          doubleFloor: nextFloorValue,
          diffToFloor: diffToFloor,
          diffToHalfFloor: diffToHalfFloor,
          diffToNextFloor: diffToNextFloor
        }
      
        if (diffToFloor <= diffToHalfFloor && diffToFloor <= diffToNextFloor) {
          return floorValue - 0.02;
        } else if (diffToHalfFloor <= diffToNextFloor) {
          return halfFloorValue;
        } else {
          return nextFloorValue - 0.02;
        }
    }

    const getTabelas = (produto: IProduto): number[] => {

        const {fatores, unitario} = produto
        const listaFatores = Object.values((fatores)).map(fator => stringToFloat(fator))

        const valorNumerico = parseFloat(unitario.replace(/,/g, '.'))
        const tabelas: IValores = {
            unitario: valorNumerico,
            tabela1: calcularTabela(valorNumerico, listaFatores),
            tabela2: valorNumerico*1.5,
            tabela3: customRound((calcularTabela(valorNumerico, listaFatores))*1.3)
        }
        return Object.values(tabelas)
    }

    const currentRef = useRef<HTMLDivElement | null>(null)
    
    // const handleClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {

    //     const scrollX = window.scrollX || document.documentElement.scrollLeft;
    //     const scrollY = window.scrollY || document.documentElement.scrollTop;

    //     const { right, top } = e.target.getBoundingClientRect()!
    //     setCoordinates((prev: {x:number, y:number}) => {
    //         const newCoordinates = { x: right + scrollX, y: top + scrollY}
    //         if(JSON.stringify(prev) === JSON.stringify(newCoordinates)) {
    //             setFatores(null)   
    //             return { x:0, y: 0}
    //         }
    //         setFatores(fatores)   
    //         return newCoordinates
    //     })

    // }
    
    const handleHover = () => {
        
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
    
        const { right, top } = currentRef.current?.getBoundingClientRect()!
        setCoordinates({ x: right + scrollX, y: top + scrollY})
        setFatores(fatores)

    }

    return (
        <div  
            className={`tr ${id} ${unitario}`}
            style={{ 
                maxHeight: '42px',
                borderRadius: 0,
                // overflow: 'hidden'
            }}
            key={(id*3.1415)}
            // onClick={ e => handleClick() }
            onMouseEnter={() => handleHover()}
            onMouseLeave={() => setFatores(null)}
            ref={(ref) => {
                if(ref) {
                    currentRef.current = ref
                }
            }}
        >
            {getTabelas(produto).map((valor: string | number, index: number) => 
                <div 
                    className='td'
                    style={{ maxHeight: '42px', padding: '9.4px', userSelect: 'none' }}
                    key={index}
                >{
                    (typeof valor === 'number')
                    ? valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4})
                    : valor
                }
                </div>
            )}
  
        </div>
    )

}