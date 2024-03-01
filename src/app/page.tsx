'use client'

import { ChangeEvent, FormEvent, SyntheticEvent, use, useEffect, useState } from 'react'
import { IValores } from '@/interfaces/IValores'
import Table from '@/components/Table/Table'
import Container from '@/components/Container/Container'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import { IFatores } from '@/interfaces/IFatores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'
import { IProduto } from '@/interfaces/IProduto'
import Converter from '@/utils/typeConversion'

import './padrao.css'
import page from './page.module.scss'
import input from './Inputs.module.scss'

export default function Home() {

  const { stringToFloat, floatToString } = Converter

  // Estados para cadastros de preços na tabela
  const [valor, setValor] = useState('')
  const [fatores, setFatores] = useState<IFatores>({
    padrao: '3',
    st: '1,01',
    transporte: '1,1',
    fator: '1,4',
    ipi: '1,065'
  })
  // const [fatores, setFatores] = useState<IFatores>({
  //   padrao: '',
  //   st: '',
  //   transporte: '',
  //   fator: '',
  //   ipi: ''
  // })
  const [valores, setValores] = useState<IValores[]>([])
  const [controleProdutos, setControleProdutos] = useState<IProduto[]>([])

  // Estados para configurações inciais (Transporte e ST)  
  const [valorTransporte, setValorTransporte] = useState('')
  const [valorTotalProdutos, setValorTotalProdutos] = useState('')
  const [valorST, setValorST] = useState('')
  const [valorTotalProdutosST, setValorTotalProdutosST] = useState('')

  // Estados para filtrar/procurar lista de valores
  const [searchParam, setSearchParam] = useState('')
  const [produtosFiltrados, setProdutosFiltrados] = useState<IProduto[]>([])
  const [sorted, setSorted] = useState<false | 'ascending' | 'descending' >(false)

  // Produto Ativo
  let displayRef = Array(controleProdutos.length).fill(false)
  const [fatoresDisplay, setFatoresDisplay] = useState<boolean[]>(displayRef)

  const adicionarValor = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (valor) {

      setControleProdutos([...controleProdutos, {
        fatores: fatores,
        unitario: valor,
        id: new Date().getTime()
      }])
  
      setValor('')
    }
  }
  
  const updateFatoresAtuais = (id: string, valor: string) => {

      setFatores((prev) => {
        
        const updateFator = {...prev, [id]: valor}
        return updateFator
        
      })

  }

  const updateFatoresProduto = (index: number) => {

    // let indexSalvo = index

    return (id: string, valor: string) => setControleProdutos(prev => {

      const updatedProducts = [...prev];
      const updatedFatores = { ...updatedProducts[index].fatores }

      updatedFatores[id as keyof IFatores] = valor as string

      updatedProducts[index] = {
        ...updatedProducts[index],
        fatores: updatedFatores,
      };

      return updatedProducts

    })

  }

  const updateValorProduto = (index: number): ((valor: string) => void) => {

    return (valor) => {

      setControleProdutos(prev => {
        const update = [...prev]
        update[index].unitario = valor
        return update
      })

    }
    
  }
 
  const calcularFatorTransporte = () => {

    const fatorTransporte = 1 + ((stringToFloat(valorTransporte) * 3.4) / stringToFloat(valorTotalProdutos))
    return floatToString(fatorTransporte)

  }

  const calcularFatorST = () => {

    const fatorST = 1 + (stringToFloat(valorST) / stringToFloat(valorTotalProdutosST))
    return floatToString(fatorST)

  }

  // const handleConfiguracaoInicial = (e: FormEvent<HTMLFormElement>) => {

  //   e.preventDefault()

  //   setFatores( prev => {
  //     const update = {
  //       ...prev,
  //       ['transporte']: calcularFatorTransporte(),
  //       ['st']: calcularFatorST(),
  //     }
  //     return update
  //   })

  // }

  const submitTransporte = (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    setFatores(prev => {
      const update = {
        ...prev,
        ['transporte']: calcularFatorTransporte()
      }
      return update
    })

  }

  const submitST = (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    setFatores(prev => {
      const update = {
        ...prev,
        ['st']: calcularFatorST()
      }
      return update
    })

  }

  const getControleProdutoIndex = (id: number): number => {

    return controleProdutos.findIndex(produto => produto.id === id)

  }

  const handleSort = (sortType: 'ascending' | 'descending') => {

    if (sorted) { 

      (sorted === sortType) ? setSorted(false) : setSorted(sortType)  

    } else {
      
      setSorted(sortType); 
      return 

    }

  }

  const resetDisplay = () => {

    setSearchParam('')
    setSorted(false)

  }

  // const handleSort = (ascending = true) => {

  //   const sortFn = (a: IProduto, b: IProduto) => {

  //     const valorA = stringToFloat(a.unitario)
  //     const valorB = stringToFloat(b.unitario)
      
  //     if (ascending) {
  //       return valorA - valorB
  //     } else {
  //       return valorB - valorA
  //     }

  //   }

  //   const sortLogic = () => {
  //     setProdutosFiltrados(sorted)
  //     // setSorted( (ascending) ? 'asceding' : 'descending' )
  //   }

  //   const sorted = produtosFiltrados.toSorted(sortFn);
  //   (!(JSON.stringify(sorted) === JSON.stringify(produtosFiltrados)))
  //   ? sortLogic()
  //   : setProdutosFiltrados(controleProdutos)

  // }

  // searchParams reset
  useEffect(() => {

    setSearchParam('')

  }, [valor])

  // useEffect -> Lógica de Busca
  // useEffect(() => {

  //   const filtrarProdutos = () => {
      
  //     const filtrado = controleProdutos.filter( produto => produto.unitario.includes(searchParam) );

  //     setProdutosFiltrados(filtrado)
  //     // (filtrado.length > 0)
  //     //   ? setProdutosFiltrados(filtrado)
  //     //   : setSearchParam('')

  //   }

  //   const resetFilter = () => {
  //     setProdutosFiltrados(controleProdutos)
  //   }

  //   (searchParam) 
  //     ? (fatoresDisplay.includes(true) || filtrarProdutos())
  //     : (fatoresDisplay.includes(true) || resetFilter())

  // }, [searchParam, controleProdutos, fatoresDisplay])

  // useEffect(() => {

  //   const sortFn = (a: IProduto, b: IProduto) => {

  //     const valorA = stringToFloat(a.unitario)
  //     const valorB = stringToFloat(b.unitario)
      
  //     if (sorted === "ascending") {
  //       return valorA - valorB
  //     } else {
  //       return valorB - valorA
  //     }

  //   }

  //   if (!sorted) return 

  //   const sortedProdutos = produtosFiltrados.toSorted(sortFn);
  //   (!(JSON.stringify(sorted) === JSON.stringify(produtosFiltrados)))
  //   ? setProdutosFiltrados(sortedProdutos)
  //   : setProdutosFiltrados([...controleProdutos])

  // }, [sorted])

  useEffect(() => {

    if (fatoresDisplay.includes(true)) return

    // setProdutosFiltrados([...controleProdutos])
    let displayProdutos = [...controleProdutos]

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

      // const sortedProdutos = produtosFiltrados.toSorted(sortFn);
      // (!(JSON.stringify(sorted) === JSON.stringify(produtosFiltrados)))
      //   ? setProdutosFiltrados(sortedProdutos)
      //   : setProdutosFiltrados([...controleProdutos])
      displayProdutos = displayProdutos.toSorted(sortFn)

    }

    if(searchParam) {

      // const filtrarProdutos = () => {
      
      //   const filtrado = controleProdutos.filter( produto => produto.unitario.includes(searchParam) );
  
      //   setProdutosFiltrados(filtrado)
  
      // }

      // (fatoresDisplay.includes(true) || filtrarProdutos())

      // (fatoresDisplay.includes(true) || displayProdutos.filter(produto => produto.unitario.includes(searchParam)))

      const filtrarProdutos = () => {

        displayProdutos = displayProdutos.filter(produto => produto.unitario.includes(searchParam))

      }

      filtrarProdutos()

    }

    setProdutosFiltrados(displayProdutos)

  }, [controleProdutos, searchParam, sorted])

  return (
    <section className={page.section}>
      <Container>
        <div
          className={page.container_descricao}
        >
          <main
            className={page.descricao}
            >
            <span className={page.span}>
              <svg className={page.logo}
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="M5.35,14.78a1.84,1.84,0,0,1,1.15.37,3.76,3.76,0,0,0,2.18.64,3.74,3.74,0,0,0,2.18-.64,2,2,0,0,1,2.3,0,4,4,0,0,0,4.36,0,2,2,0,0,1,2.3,0,3.77,3.77,0,0,0,2.16.64v-2a1.89,1.89,0,0,1-1.15-.36,4,4,0,0,0-4.36,0,1.77,1.77,0,0,1-1.15.36,1.89,1.89,0,0,1-1.15-.36,4,4,0,0,0-4.36,0,1.77,1.77,0,0,1-1.15.36,1.89,1.89,0,0,1-1.15-.36,3.82,3.82,0,0,0-2.18-.65,3.82,3.82,0,0,0-2.18.65A1.77,1.77,0,0,1,2,13.77v2a3.9,3.9,0,0,0,2.2-.64A1.84,1.84,0,0,1,5.35,14.78Z"/>
                  <path d="M22,15.79s0,0,0,0h0Z"/>
                  <path d="M16.49,18a1.77,1.77,0,0,1-1.15.36A1.89,1.89,0,0,1,14.19,18,3.82,3.82,0,0,0,12,17.31,3.88,3.88,0,0,0,9.82,18a1.75,1.75,0,0,1-1.15.36A1.77,1.77,0,0,1,7.52,18a3.87,3.87,0,0,0-2.18-.65A3.88,3.88,0,0,0,3.15,18,1.77,1.77,0,0,1,2,18.32v2a4,4,0,0,0,2.19-.65,1.82,1.82,0,0,1,1.15-.37,1.84,1.84,0,0,1,1.15.37,3.87,3.87,0,0,0,2.18.65,4,4,0,0,0,2.19-.65,2,2,0,0,1,2.3,0,4,4,0,0,0,4.36,0,2,2,0,0,1,2.3,0,3.82,3.82,0,0,0,2.18.65h0v-2A1.77,1.77,0,0,1,20.85,18,4,4,0,0,0,16.49,18Z"/>
                  <path d="M22,6.69h0Z"/>
                  <path d="M5.35,5.68A1.89,1.89,0,0,1,6.5,6a3.85,3.85,0,0,0,2.18.65A3.82,3.82,0,0,0,10.86,6,1.77,1.77,0,0,1,12,5.68,1.89,1.89,0,0,1,13.16,6a4,4,0,0,0,4.36,0,1.77,1.77,0,0,1,1.15-.36A1.89,1.89,0,0,1,19.82,6,3.78,3.78,0,0,0,22,6.69v-2a1.84,1.84,0,0,1-1.15-.37,4,4,0,0,0-4.36,0,2,2,0,0,1-2.3,0,4,4,0,0,0-4.36,0,2,2,0,0,1-2.3,0,3.82,3.82,0,0,0-2.18-.65,3.82,3.82,0,0,0-2.18.65A1.84,1.84,0,0,1,2,4.67v2A3.91,3.91,0,0,0,4.2,6,1.77,1.77,0,0,1,5.35,5.68Z"/>
                  <path d="M20.85,8.85a4,4,0,0,0-4.36,0,2,2,0,0,1-2.3,0A3.74,3.74,0,0,0,12,8.21a3.87,3.87,0,0,0-2.19.64,1.82,1.82,0,0,1-1.15.37,1.78,1.78,0,0,1-1.15-.37,3.78,3.78,0,0,0-2.18-.64,3.87,3.87,0,0,0-2.19.64A1.84,1.84,0,0,1,2,9.22v2a3.88,3.88,0,0,0,2.19-.65,1.75,1.75,0,0,1,1.15-.36,1.77,1.77,0,0,1,1.15.36,4,4,0,0,0,4.37,0A1.77,1.77,0,0,1,12,10.23a1.89,1.89,0,0,1,1.15.36,4,4,0,0,0,4.36,0,1.77,1.77,0,0,1,1.15-.36,1.89,1.89,0,0,1,1.15.36,3.82,3.82,0,0,0,2.18.65h0v-2A1.84,1.84,0,0,1,20.85,8.85Z"/>
                </g>
                <rect width="24" height="24" fill="none"/>
              </svg>
              <h2>TABELA DE PREÇOS</h2>
              {/* <p>
                Bem vindo ao Data Flow, para calcular os preços das tabelas dos produtos você pode começar preenchendo esses espaços abaixo ou, se preferir, preencher diretamente os fatores ao lado! Depois que preencher todos os preços são calculados automáticamente! Experimente:
              </p> */}
            </span>
            <div
              className={input.form_container}
            >
              <form 
                className={input.span}
                onSubmit={submitTransporte}
              >
                <NumberInput
                  label='Transporte' 
                  placeholder={'Valor Transporte'} 
                  valor={valorTransporte} 
                  setValor={setValorTransporte}              
                />
                <NumberInput
                  label='Total Produtos' 
                  placeholder={'Total Produtos'} 
                  valor={valorTotalProdutos} 
                  setValor={setValorTotalProdutos}              
                />
                <button>
                  <svg 
                    viewBox="0 0 32 32" 
                    xmlns="http://www.w3.org/2000/svg"><path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"/></svg>
                </button>
              </form>
              <form 
                className={input.span}
                onSubmit={submitST}
              >
                <NumberInput
                  label='Total Produtos com ST' 
                  placeholder={'Total Produtos ST'} 
                  valor={valorTotalProdutosST} 
                  setValor={setValorTotalProdutosST}              
                />
                <NumberInput
                  label='Total ST' 
                  placeholder={'Valor Total ST'} 
                  valor={valorST} 
                  setValor={setValorST}              
                />
                <button>
                  <svg 
                    viewBox="0 0 32 32" 
                    xmlns="http://www.w3.org/2000/svg"><path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"/></svg>
                </button>
                {/* <input type="submit" hidden/> */}
              </form>
            </div>
          </main>
          
        </div>
          <FatoresTable
            display={true}
            fatores={fatores}
            setFatores={updateFatoresAtuais}
            valor={valor}
            setValor={setValor}
            handleSubmit={adicionarValor}
          />
        {/* <div className={page.container_tabela}>
        </div> */}
        </Container>
        <div className={page.table}>
        {controleProdutos.length > 0 &&
        <>
        <div
          className={input.sort}
        >
          <button className={input.button} >
            <svg 
              onClick={() => handleSort('ascending')}
              style={{opacity: `${sorted === 'ascending' ? '1' : '0.3'}`}} 
              width="25px" 
              height="25px" 
              viewBox="0 0 32 32" 
              xmlns="http://www.w3.org/2000/svg">
                <path d="M24 11.305l-7.997 11.39L8 11.305z"/>
              </svg>
          </button>
          <button className={input.button} >
            <svg 
              onClick={() => handleSort('descending')} 
              style={{opacity: `${sorted === 'descending' ? '1' : '0.3'}`}} 
              fill="#000000" 
              width="25px" 
              height="25px" 
              viewBox="0 0 32 32" 
              xmlns="http://www.w3.org/2000/svg">
              <path d="M8 20.695l7.997-11.39L24 20.695z"/>
            </svg>
          </button>
        </div>
        <span
          className={input.container}
        >
          {searchParam.length > 0 
          
          ? <button className={input.clear} >
              <svg
                style={{opacity: `${searchParam.length > 0 ? '1' : '0'}`}}
                onClick={() => setSearchParam('')}
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
          : <svg 
              className={input.lupa}
              width="25px" 
              height="25px" 
              viewBox="-100 -300 2700 2700" 
              xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M1458.948 1305.626c104.637-136.95 167.527-307.187 167.527-492.388C1626.475 364.764 1261.711 0 813.238 0 364.764 0 0 364.764 0 813.238c0 448.473 364.764 813.237 813.238 813.237 185.201 0 355.547-62.89 492.496-167.527L1766.678 1920 1920 1766.678l-461.052-461.052Zm-645.71 103.986c-328.874 0-596.375-267.61-596.375-596.374 0-328.765 267.501-596.375 596.375-596.375 328.873 0 596.374 267.61 596.374 596.375s-267.501 596.374-596.374 596.374Z" fillRule="evenodd"/>
            </svg>
          }
          <NumberInput 
            placeholder='Buscar'
            valor={searchParam}
            setValor={setSearchParam}
            className={input.search}
            onKeyDown={(e: KeyboardEvent) => {if(e.key === 'Escape') setSearchParam('')}}
            // required={false}
            // onBlur={() => setSearchParam('')}
          />
      
        </span>
        </>
        }
        <Table 
          valores={valores} 
          controleProdutos={produtosFiltrados}
          setControleProdutos={setControleProdutos}
          setFatores={updateFatoresProduto}
          setValor={updateValorProduto}
          fatoresDisplay={fatoresDisplay}
          setFatoresDisplay={setFatoresDisplay}
          getIndex={getControleProdutoIndex}
        />
        </div>
    </ section>

  )
}
