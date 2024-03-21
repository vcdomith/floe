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

import './padrao.scss'
import page from './page.module.scss'
import input from './Inputs.module.scss'
import vars from './globalStyle.module.scss'
import SvgArray from '@/components/SvgArray/SvgArray'
import interpolateColors from '@/utils/colorSteps'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import { ICadastro } from '@/interfaces/ICadastro'

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

  const formatValor = (valor: string): string => {

    if (valor === ',') return '0,0'

    const valorFloat = stringToFloat(valor)
    const fracional = valorFloat % 1 !== 0
    const leadingComma = valor.startsWith(',')
    const trailingComma = valor.endsWith(',')

    const valorFormatado = fracional
      ? leadingComma ? '0' + valor : valor
      : trailingComma ? valor + '0' : valor + ',0' 

    return valorFormatado 

  }

  const adicionarValor = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    
    if (valor) {

      const valorFormat = formatValor(valor)

      setControleProdutos([...controleProdutos, {
        fatores: fatores,
        unitario: valorFormat,
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

  const handleSave = () => {

    
    const cadastro: ICadastro = {
      id: new Date().getTime(),
      produtos: controleProdutos,
      data: new Date().toLocaleString(),
    }
    const cadastroString = JSON.stringify(cadastro)

    const keyToSave = cadastro.id.toString()
    localStorage.setItem(keyToSave, cadastroString)

    console.log('Cadastro realizado com sucesso!');

  }

  // searchParams reset

  // useEffect(() => {

  //   if (fatoresDisplay.includes(true)) return

  //   // setProdutosFiltrados([...controleProdutos])
  //   let displayProdutos = [...controleProdutos]

  //   if(sorted) {

  //     const sortFn = (a: IProduto, b: IProduto) => {

  //       const valorA = stringToFloat(a.unitario)
  //       const valorB = stringToFloat(b.unitario)
        
  //       if (sorted === "ascending") {
  //         return valorA - valorB
  //       } else {
  //         return valorB - valorA
  //       }
  
  //     }

  //     displayProdutos = displayProdutos.toSorted(sortFn)

  //   }

  //   if(searchParam) {

  //     const filtrarProdutos = () => {

  //       displayProdutos = displayProdutos.filter(produto => produto.unitario.includes(searchParam))

  //     }

  //     filtrarProdutos()

  //   }

  //   setProdutosFiltrados(displayProdutos)

  // }, [controleProdutos, searchParam, sorted])

  return (
    <>
    {/* <div className={page.bg}></div> */}
    <SvgArray className={page.background} interval={1000}/>
    {/* <div className={page.backgroundOverlay}></div> */}

    <section className={page.section}>
      <Container>
        <div
          className={page.container_descricao}
        >
          <main
            className={page.descricao}
            >
            <span className={page.span}>
              {/* <SvgArray className={page.logoHole} interval={1000}/> */}
              <LogoSvg loop={false}/>
              
              {/* <h2>TABELA DE PREÇOS</h2> */}
              <h2>Tabela de Preços</h2>
              {/* <h2>Floe</h2> */}
              {/* <h2>RipTide</h2> */}
  
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
        <span className={input.filtros}>
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
            className={input.search}
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
              className={input.input}
              onKeyDown={(e: KeyboardEvent) => {if(e.key === 'Escape') setSearchParam('')}}
              // required={false}
              // onBlur={() => setSearchParam('')}
            />
        
          </span>
        </span>
        }
        <Table 
          valores={valores} 
          controleProdutos={controleProdutos}
          filtros={{ searchParam: searchParam, sorted: sorted }}
          setControleProdutos={setControleProdutos}
          setFatores={updateFatoresProduto}
          setValor={updateValorProduto}
          fatoresDisplay={fatoresDisplay}
          setFatoresDisplay={setFatoresDisplay}
          getIndex={getControleProdutoIndex}
        />
        </div>
        <button
          onClick={() => handleSave()}
        >
          Salvar Dados
        </button>
    </ section>
    
    </>
  )
}