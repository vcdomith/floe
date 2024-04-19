'use client'

import { ICadastro } from "@/interfaces/ICadastro"
import { IProduto } from "@/interfaces/IProduto"
import { IValores } from "@/interfaces/IValores"
import Converter from "@/utils/typeConversion"
import { table } from "console"
import { useEffect, useState } from "react"

import '@/components/Table/TableBody/TableBody.scss'

import style from './Cadastro.module.scss'
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import Search from "@/components/Search/Search"

interface CadastroProps {
    cadastro: ICadastro
}

const Cadastro = ({ cadastro }: CadastroProps) => {

    const [display, setDisplay] = useState(false)

    const [pattern, setPattern] = useState("M0 377C78.5 377 123.995 199 246.5 199C359.5 199 130.5 199 261.5 199C384.577 199 402.5 376.5 500 376.5")

    const controleProdutos = cadastro.produtos
    const dateTime = new Date(cadastro.created_at).toLocaleString().split(',')

    // States that renders table values
    const [produtos, setProdutos] = useState(cadastro.produtos)
    const resetProdutos = () => setProdutos(controleProdutos)
    const [busca, setBusca] = useState('')

    useEffect(() => {

        console.log(busca);

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
    }, [display])

    const { id, created_at } = cadastro

    const { stringToFloat } = Converter

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
    
        let a = {
          value: value,
          floor: floorValue, 
          halfFloor: halfFloorValue,
          doubleFloor: nextFloorValue,
          diffToFloor: diffToFloor,
          diffToHalfFloor: diffToHalfFloor,
          diffToNextFloor: diffToNextFloor
        }
        
        // console.table(a);
      
        if (diffToFloor <= diffToHalfFloor && diffToFloor <= diffToNextFloor) {
          return floorValue - 0.02;
        } else if (diffToHalfFloor <= diffToNextFloor) {
          return halfFloorValue;
        } else {
          return nextFloorValue - 0.02;
        }
    }

    const getIndex = (id: number): number => {

        return produtos.findIndex(produto => produto.id === id)
    
    }

    const getTabelas = (id: number): number[] => {

        const {fatores, unitario} = produtos[getIndex(id)]
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

    useEffect(() => {

        // const paths = [
        // `M0 276C78.5 276 123.995 454 246.5 454C359.5 454 130.5 454 261.5 454C384.577 454 402.5 276.5 500 276.5`,
        // "M0 377C78.5 377 123.995 199 246.5 199C359.5 199 130.5 199 261.5 199C384.577 199 402.5 376.5 500 376.5"
        // ]

        const paths = [
            "M0 161C78.5 161 123.995 339 246.5 339C359.5 339 130.5 339 261.5 339C384.577 339 402.5 161.5 500 161.5",
            "M0 339C78.5 339 123.995 161 246.5 161C359.5 161 130.5 161 261.5 161C384.577 161 402.5 338.5 500 338.5"
        ]

        const intervalId = setInterval(() => {

            setPattern(prev => {
                if (paths[0] === prev) {

                return paths[1]
                } 

                return paths[0]
            })

        }, 15000/produtos.length)

        return () => clearInterval(intervalId)

    }, [produtos.length])

    return (
        <>    
        <span 
            className={display ? `${style.wrapper} ${style.active}` : style.wrapper }
        >
            <div><strong style={{ fontSize: '1.1rem', fontWeight: 600 }}>{id}</strong></div>
            <div><strong>{dateTime[0]}</strong> <span style={{ fontWeight: 400, fontSize: '0.8rem'}}>as {dateTime[1].slice(1,)}</span></div>
            <div><strong>Denlex</strong></div>
            {/* <div>{`${cadastro.produtos.length} produtos`}</div> */}
            {!display
            ?
            <svg 
            className={style.scroll}
            style={{ transition: `d ${1000/produtos.length}ms`}}
            // onMouseEnter={() => setPattern("M0 199C78.5 199 238.5 269 238.5 377C238.5 485 259 487 259 377C259 267 402.5 199.5 500 199.5")}
            // onMouseLeave={() => setPattern("M0 276C78.5 276 123.995 454 246.5 454C359.5 454 130.5 454 261.5 454C384.577 454 402.5 276.5 500 276.5")}
            >
                <defs>
                <pattern id={`pattern${id}`} patternUnits="userSpaceOnUse" x={0} y={0} width='50' height="50">
                <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={pattern} style={{ transition: `d ${20000/produtos.length}ms`}} stroke="black" strokeWidth='40'/>
                </svg>
                <rect width='100%' height='100%' fill={`url(#pattern${id})`}/>
                </pattern>
                </defs>
                <rect width='100%' height='100%' fill={`url(#pattern${id})`}/>
            </svg>
            :
            <span
                className={style.scroll}
            >
                <Search
                    className={style.search}
                    searchParam={busca}
                    setSearchParam={setBusca}
                />    
            </span>
            }
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
                height: `${display ? produtos.length*42 : 0}px`,
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
            {produtos.map(({ id, unitario }, index) => 
            
                <div  
                    className={`tr ${id} ${unitario}`}
                    style={{ 
                        maxHeight: '42px',
                        borderRadius: 0,
                        // overflow: 'hidden'
                     }}
                    key={(id*3.1415)}
                >
                    {getTabelas(id).map((valor: string | number, index: number) => 
                        <div 
                            className='td'
                            style={{ maxHeight: '42px', padding: '9.4px' }}
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