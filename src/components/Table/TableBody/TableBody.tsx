import { IFatores } from '@/interfaces/IFatores'
import './TableBody.scss'
import { IValores } from '@/interfaces/IValores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'
import { IProduto } from '@/interfaces/IProduto'
import { MouseEvent, useEffect, useState } from 'react'



interface TableBodyProps {

    controleProdutos: IProduto[]
    setControleProdutos: (fator: (arr:IProduto[]) => IProduto[]) => void

    setFatores: (index: number) => (id: string, valor: string) => void

    setValor: (index: number) => ((valor: string) => void)

}

const TableBody = ({ controleProdutos, setControleProdutos, setFatores, setValor }: TableBodyProps) => {

    let displayControl = Array(controleProdutos.length).fill(false)

    const [fatoresDisplay, setFatoresDisplay] = useState<boolean[]>(displayControl)

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

    const excluirLinha = (index: number) => {

        // setValores((valores).filter((valor, id) => index !== id))
    
        setControleProdutos((prev) => {
            const updated = [...prev]
            updated.splice(index, 1)
            return updated
        })

    }

    const mostrarFatores = (index: number) => {

        setFatoresDisplay((prev) => {
            
            const control = [...displayControl]
            control[index] = (control[index] === prev[index])? true : false
            return control
        
        })

        // console.log(controleProdutos[index]);

    }

    const handleModalClick = (index: number, e: MouseEvent<HTMLElement, MouseEvent<Element, MouseEvent>>) => {

      if (e.target.localName === 'section') {

        mostrarFatores(index)
        return

      } else {

        return

      }

    }

    const getTabelas = (index: number): number[] => {

        const {fatores, unitario} = controleProdutos[index]
        const listaFatores = Object.values((fatores)).map(fator => parseFloat(fator.replace(/,/g, '.')))

        const valorNumerico = parseFloat(unitario.replace(/,/g, '.'))
        const tabelas: IValores = {
            unitario: valorNumerico,
            tabela1: calcularTabela(valorNumerico, listaFatores),
            tabela2: customRound(valorNumerico*1.5),
            tabela3: customRound((calcularTabela(valorNumerico, listaFatores))*1.3)
        }
        return Object.values(tabelas)
    }

    useEffect(() => {

        if (controleProdutos.length !== fatoresDisplay.length)
            setFatoresDisplay(Array(controleProdutos.length).fill(false))

    }, [controleProdutos, fatoresDisplay.length])

  return (
    <div className='tbody'>
        {}
            {controleProdutos.map(({}, index) => 
                <div  
                    className='tr'
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
                    <>
                    
                    <svg 
                        onClick={() => mostrarFatores(index)}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M6.001 7.128L6 10.438l19.998-.005L26 7.124zM6.001 21.566L6 24.876l19.998-.006.002-3.308zM6.001 14.341L6 17.65l19.998-.004.002-3.309z"
                            />
                    </svg>
                    
                    <svg 
                        onClick={() => excluirLinha(index)}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                            />
                    </svg>
                    <>
                    <section 
                        className='backdrop'
                        hidden={!fatoresDisplay[index]}
                        onClick={(e) => handleModalClick(index, e)}
                    >    
                    </section>
                    <FatoresTable
                        display={fatoresDisplay[index]}
                        fatores={controleProdutos[index].fatores}
                        setFatores={setFatores(index)}
                        valor={controleProdutos[index].unitario}
                        setValor={setValor(index)}
                        handleSubmit={e => {
                            e.preventDefault()
                            mostrarFatores(index)
                        }}
                    />
                    </>

                    </>
                    
                </div>
            
            )}
        </div>
  )
}

export default TableBody