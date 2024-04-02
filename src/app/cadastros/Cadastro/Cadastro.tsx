'use client'

import { ICadastro } from "@/interfaces/ICadastro"
import { IProduto } from "@/interfaces/IProduto"
import { IValores } from "@/interfaces/IValores"
import Converter from "@/utils/typeConversion"
import { table } from "console"
import { useState } from "react"

import '@/components/Table/TableBody/TableBody.scss'

interface CadastroProps {
    cadastro: ICadastro
}

const Cadastro = ({ cadastro }: CadastroProps) => {

    const [display, setDisplay] = useState(false)

    const { id, created_at, produtos } = cadastro

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

    const getTabelas = (index: number): number[] => {

        const {fatores, unitario} = produtos[index]
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

    return (
        <>    
        <span 
            style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                backgroundColor: 'white',
                width: '100%',
                height: '55.2px',
                borderBottom: `${display ? '2px solid purple' : '2px solid transparent'}`,
                transition: 'border-color 600ms ease-out',
            }}
        >
            <div>{id}</div>
            <div>{new Date(created_at).toLocaleString()}</div>
            <div>{`${produtos.length} produtos`}</div>
            {/* {produtos.map(({ id, unitario, fatores }: IProduto) => 
                <td key={id}>
                    <p>{unitario}</p>
                </td>   
            )} */}
            <button
                onClick={() => setDisplay(prev => !prev)}
            >
                mostar
            </button>
        </span>
        <div 
            className='tbody' 
            style={{
                height: `${display ? produtos.length*55.2 : 0}px`,
                transition: `height ${(55.2*produtos.length)/0.6}ms ease-out`,
                overflow: "hidden",
            }}
        >  
            {produtos.map(({ id }, index) => 
            
                <div  
                    className={`tr`}
                    key={(index*3.1415)}
                >
                    {getTabelas(index).map((valor: string | number, index: number) => 
                        <div 
                            className='td'
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