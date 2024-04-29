import { IFatores } from '@/interfaces/IFatores'
import './TableBody.scss'
import { IValores } from '@/interfaces/IValores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'
import { IProduto } from '@/interfaces/IProduto'
import { Dispatch, MouseEvent, MutableRefObject, SetStateAction, TransitionEvent, forwardRef, use, useEffect, useMemo, useRef, useState } from 'react'
import Converter from '@/utils/typeConversion'
import { get } from 'http'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import NoMatch from '@/components/SvgArray/NoMatch'
import { getTabelas } from '@/utils/calculoTabelas'
import { motion, AnimatePresence } from 'framer-motion'

interface TableBodyProps {

    controleProdutos: IProduto[]
    setControleProdutos: (fator: (arr:IProduto[]) => IProduto[]) => void
    filtros: { searchParam: string, sorted: false | "ascending" | "descending" }

    setFatores: (index: number) => (id: string, valor: string) => void

    setValor: (index: number) => ((valor: string) => void)

    fatoresDisplay: boolean[]
    setModalDisplay: (value: boolean) => void
    setFatoresDisplay: Dispatch<SetStateAction<boolean[]>>

    getIndex: (id: number) => number

}

const TableBody = ({ controleProdutos, setControleProdutos, setFatores, setValor, fatoresDisplay, setFatoresDisplay, getIndex, filtros, setModalDisplay }: TableBodyProps) => {

    const produtosFiltrados = useRef<IProduto[] | null>(null)

    const { stringToFloat } = Converter

    const { searchParam, sorted } = filtros

    let displayControl = Array(controleProdutos.length).fill(false)

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

    const produtoAtivo = fatoresDisplay.includes(true)

    useEffect(() => {

        if (controleProdutos.length !== fatoresDisplay.length)
            setFatoresDisplay(Array(controleProdutos.length).fill(false))
        console.log(controleProdutos);
            
    }, [controleProdutos, fatoresDisplay.length, setFatoresDisplay])

    const produtosDisplay = useMemo(() => {

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
        return aplicarFiltros(controleProdutos)

    }, [controleProdutos, searchParam, produtoAtivo, sorted, stringToFloat])

  return(
    
    <div 
        className='tbody' 
        style={{
            height: `${produtosDisplay.length > 0 ? produtosDisplay.length*55.2 : 150}px`,
            // transition: `height ${400+(50*(produtosDisplay.length))}ms ease-out`
            transition: `height 600ms ease-out`
        }}
    >  
        {(produtosDisplay.length > 0) 

        ?
        produtosDisplay.map((produto, index) => 
            <Produto
                key={produto.id} 
                mostrarFatores={mostrarFatores} 
                index={index} 
                controleProdutos={controleProdutos} 
                setControleProdutos={setControleProdutos} 
                produto={produto} 
                getIndex={getIndex} 
                setFatores={setFatores} 
                setValor={setValor} 
                fatoresDisplay={fatoresDisplay}
                setModalDisplay={setModalDisplay}
            />
        )
        
        : 
        <div className='empty'>
            <span>
                <NoMatch />
                <p>Nenhum dado correponde à pesquisa!</p>
            </span>
        </div>

    }
    </div>
  )
}

export default TableBody

interface ProdutoProps {

    mostrarFatores: (index: number) => void
    index: number
    controleProdutos: IProduto[]
    setControleProdutos: (fator: (arr:IProduto[]) => IProduto[]) => void
    produto: IProduto
    getIndex: (id: number) => number
    setFatores: (index: number) => (id: string, valor: string) => void
    setValor: (index: number) => ((valor: string) => void)
    fatoresDisplay: boolean[]
    setModalDisplay: (value: boolean) => void

}

// Esse deve ser o componente que controla os fatores
function Produto({ mostrarFatores, index, controleProdutos, setControleProdutos, produto, getIndex, setFatores, setValor, setModalDisplay }: ProdutoProps) {

    const [displayFatores, setDisplayFatores] = useState(false)

    const handleModalClick = (index: number, e: MouseEvent<HTMLElement, MouseEvent<Element, MouseEvent>>) => {

        if ((e.target as HTMLElement).localName === 'section') {
  
            // mostrarFatores(index)
            setDisplayFatores(false)
            setModalDisplay(false)
            return
  
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

    return (
        <div  
            onClick={() => console.log(produto)}
            className={`tr`}
            key={(produto.id)}
        >
            {getTabelas(produto).map((valor: string | number, index: number) => 
                <div 
                    className='td'
                    key={produto.id+index}
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
                onClick={() => {
                    setDisplayFatores(true)
                    setModalDisplay(true)

                }}
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
                onClick={() => excluirLinha(getIndex(produto.id))}
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
        {displayFatores
        ?
        <>
        <section 
            className='backdrop'
            onClick={(e) => handleModalClick(index, e as any)}
        >    
        </section>
        <FatoresTable
            display
            fatores={controleProdutos[getIndex(produto.id)].fatores}
            setFatores={setFatores(getIndex(produto.id))}
            valor={controleProdutos[getIndex(produto.id)].unitario}
            setValor={setValor(getIndex(produto.id))}
            handleSubmit={e => {
                e.preventDefault()
                setDisplayFatores(false)
                setModalDisplay(false)
                
            }}
        />
        </>
        :
        ''
        }

        </>
            
        </div>
    )

}
