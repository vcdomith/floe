import { IFatores } from '@/interfaces/IFatores'
import './TableBody.scss'
import { IValores } from '@/interfaces/IValores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'
import { IProduto } from '@/interfaces/IProduto'
import { Dispatch, MouseEvent, SetStateAction, TransitionEvent, use, useEffect, useRef, useState } from 'react'
import Converter from '@/utils/typeConversion'
import { get } from 'http'

interface TableBodyProps {

    controleProdutos: IProduto[]
    setControleProdutos: (fator: (arr:IProduto[]) => IProduto[]) => void
    filtros: { searchParam: string, sorted: false | "ascending" | "descending" }

    setFatores: (index: number) => (id: string, valor: string) => void

    setValor: (index: number) => ((valor: string) => void)

    fatoresDisplay: boolean[]
    setFatoresDisplay: Dispatch<SetStateAction<boolean[]>>

    getIndex: (id: number) => number

}

const TableBody = ({ controleProdutos, setControleProdutos, setFatores, setValor, fatoresDisplay, setFatoresDisplay, getIndex, filtros }: TableBodyProps) => {

    const produtosFiltrados = useRef<IProduto[] | null>(null)

    const { stringToFloat } = Converter

    const { searchParam, sorted } = filtros

    let displayControl = Array(controleProdutos.length).fill(false)

    // const [fatoresDisplay, setFatoresDisplay] = useState<boolean[]>(displayControl)

    // const getIndex = (id: number): number => {

    //     return controleProdutos.findIndex(produto => produto.id === id)

    // }

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

        setControleProdutos((prev) => {
            const updated = [...prev];

            (updated.length > 1) 
                ? updated.splice(index, 1)
                : updated.splice(0, 1)
 
            return updated
        })

    }

    const mostrarFatores = (index: number) => {

        setFatoresDisplay((prev) => {
            
            const control = [...displayControl]
            control[index] = (control[index] === prev[index])? true : false
            return control
        
        })

    }

    const handleModalClick = (index: number, e: MouseEvent<HTMLElement, MouseEvent<Element, MouseEvent>>) => {

      if ((e.target as HTMLElement).localName === 'section') {

        mostrarFatores(index)
        return

      }

    }

    const getTabelas = (index: number): number[] => {

        const {fatores, unitario} = controleProdutos[index]
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

    const aplicarFiltros = (produtos: IProduto[]) => {

        
        let displayProdutos = [...produtos]
        if(produtoAtivo && produtosFiltrados.current !== null) return produtosFiltrados.current

        if(sorted) {

        const sortFn = (a: IProduto, b: IProduto) => {

            const valorA = stringToFloat(a.unitario)
            const valorB = stringToFloat(b.unitario)
            
            if (sorted === "ascending") {
            return valorA - valorB
            } else {
            return valorB - valorA
            }
    
        }

            displayProdutos = displayProdutos.toSorted(sortFn)

        }

        if(searchParam) {

        const filtrarProdutos = () => {

            displayProdutos = displayProdutos.filter(produto => produto.unitario.includes(searchParam))

        }

        filtrarProdutos()

        }

        // setProdutosFiltrados(displayProdutos)

        produtosFiltrados.current = displayProdutos
        return displayProdutos

    }

    const produtoAtivo = fatoresDisplay.includes(true)

    useEffect(() => {

        if (controleProdutos.length !== fatoresDisplay.length)
            setFatoresDisplay(Array(controleProdutos.length).fill(false))

            
    }, [controleProdutos, fatoresDisplay.length, setFatoresDisplay])

  return(
    
    <div 
        className='tbody' 
        style={{
            height: `${aplicarFiltros(controleProdutos).length > 0 ? aplicarFiltros(controleProdutos).length*55.2 : 200}px`,
            transition: `height ${400+(50*(aplicarFiltros(controleProdutos).length))}ms ease-out`
        }}
    >  
        {(aplicarFiltros(controleProdutos).length > 0) 

        ?
        aplicarFiltros(controleProdutos).map(({ id }, index) => 
        
            <div  
                className={`tr`}
                // onClick={() => console.log(aplicarFiltros(controleProdutos))}
                // onClick={() => console.log(fatoresDisplay.includes(true))}
                onClick={() => console.log(produtosFiltrados)}
                key={(index*3.1415)}
            >
                {getTabelas(getIndex(id)).map((valor: string | number, index: number) => 
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
            
            <button>
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
            </button>
            
            <button>
                <svg 
                    onClick={() => excluirLinha(getIndex(id))}
                    width="25px" 
                    height="25px" 
                    viewBox="0 0 32 32" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                        <path 
                            d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                        />
                </svg>
            </button>
            <>
            <section 
                className='backdrop'
                hidden={!fatoresDisplay[index]}
                onClick={(e) => handleModalClick(index, e as any)}
            >    
            </section>
            <FatoresTable
                display={fatoresDisplay[index]}
                fatores={controleProdutos[getIndex(id)].fatores}
                setFatores={setFatores(getIndex(id))}
                valor={controleProdutos[getIndex(id)].unitario}
                setValor={setValor(getIndex(id))}
                handleSubmit={e => {
                    e.preventDefault()
                    mostrarFatores(index)
                }}
            />
            </>

            </>
                
            </div>
        )
        
        : 
        <div className='empty'>
            <span>
            <svg width="50px" height="50px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.893 131.912l4.46 4.69 2.446 1.474 5.38 6.5 5.79 9.75 5.078 11.62 1.93 5.485 7.14-16.037 7.304-23.997 6.195-22.475 7.541-25.745 6.6-18.934 16.86.197s2.362 8.456 5.281 15.743c2.92 7.287 3.8 9.827 6.805 15.421 3.005 5.595 2.535 7.704 6.853 10.01s8.505 3.917 13.7-.034c5.195-3.951 5.944-6.498 9.038-14.544 3.094-8.046 6.703-16.39 6.703-16.39l4.266-11.376 15.742.29 5.441 15.985 3.654 16.758 3.453 11.883 4.768 15.94 4.517 14.87 3.35 10.835 8.068 19.517 8.43-16.59 12.177-16.284 6.196-4.408v20.692l-5.068 8.06-6.562 14.624-4.41 13-1.17 3.638-16.463-.325s-3.706-7.796-7.227-16.116c-3.52-8.32-2.7-6.092-6.662-16.703-3.962-10.611-4.306-10.983-7.521-21.282-3.216-10.299-1.807-6.957-5.586-20.7-3.78-13.744-7.664-27.476-7.664-27.476s-4.545 8.716-7.894 14.32c-3.349 5.604-3.732 6.807-7.28 11.07-3.549 4.264-3.972 5.41-8.61 8.023-4.639 2.612-5.317 3.693-11.734 3.435s-5.726.902-12.608-4.415c-6.883-5.317-9.84-12.928-9.84-12.928l-9.947-19.675-6.46 18.273-4.717 16.656-4.047 15.298-6.152 19.5-6.043 16.71-7.825 16.01-17.727-.172-4.82-16.194-6.766-15.777-4.363-6.854v-20.846z" fill-rule="evenodd"/>
            </svg>
                <p>Nenhum dado correponde à pesquisa!</p>
            </span>
        </div>

    }
    </div>
  )
}

export default TableBody