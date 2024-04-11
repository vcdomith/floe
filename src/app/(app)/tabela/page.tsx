'use client'

import { ChangeEvent, FormEvent, Suspense, SyntheticEvent, use, useEffect, useMemo, useRef, useState } from 'react'
import { IValores } from '@/interfaces/IValores'
import Table from '@/components/Table/Table'
import Container from '@/components/Container/Container'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import { IFatores } from '@/interfaces/IFatores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'
import { IProduto } from '@/interfaces/IProduto'
import Converter from '@/utils/typeConversion'

import '@/app/padrao.scss'
import page from './page.module.scss'
import input from '@/app/Inputs.module.scss'
import '@/app/globalStyle.module.scss'
import SvgArray from '@/components/SvgArray/SvgArray'
import interpolateColors from '@/utils/colorSteps'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import { ICadastro } from '@/interfaces/ICadastro'
import NoMatch from '@/components/SvgArray/NoMatch'
import { dbConnect } from '@/utils/db/supabase'
import Link from 'next/link'
import Loading from '../../loading/page'

export default function Home() {
  
  // Utils
  const { stringToFloat, floatToString } = Converter

  // Conexão DB
  const supabase = useMemo(() => dbConnect(), [])
  
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

  const scrollRef = useRef<SVGSVGElement | null>(null)

  const [pattern, setPattern] = useState("M250 344.5C129.581 344.5 0 159.5 0 159.5V500H500V159.5C500 159.5 370.419 344.5 250 344.5Z")

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
      created_at: new Date().toLocaleString(),
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

  async function handleSaveDB() {

    if (controleProdutos.length === 0) {
      console.log('Não é possível fazer um cadastro vazio!');
      return
    }

    try {

      let { data: cadastros, error } = await supabase
        .from('cadastros')
        .insert([{ produtos: controleProdutos }])
      
      console.log('Cadastro realizado com sucesso!', cadastros);

      // let { data: cadastros, error } = await supabase
      //   .from('cadastros')
      //   .select('produtos')

      // console.log(cadastros);

    } catch(error) {

      console.error(error)

    }
    
  }
  
  async function handleReadDB() {

    try {

      let { data: produtos, error } = await supabase
        .from('cadastros')
        .select()
      
      console.log(produtos);
  
  
    } catch(error) {
  
      console.error(error)
  
    }

  }

  const [iconPat, setIconPat] = useState("M0 161C78.5 161 123.995 339 246.5 339C359.5 339 130.5 339 261.5 339C384.577 339 402.5 161.5 500 161.5")

  useEffect(() => {

    // const paths = [
    //   "M0 161C78.5 161 123.995 339 246.5 339C359.5 339 130.5 339 261.5 339C384.577 339 402.5 161.5 500 161.5",
    //   "M0 339C78.5 339 123.995 161 246.5 161C359.5 161 130.5 161 261.5 161C384.577 161 402.5 338.5 500 338.5"
    // ]
    const paths = [
      "M178.5 250C65 250 62.5 275.5 0 275.5V500H500V275.5C437.5 275.5 292 250 178.5 250Z",
      "M340 147C226.5 147 62.5 202.015 0 202.015V500H500V202.015C476.5 202.015 453.5 147 340 147Z"
    ]

    const intervalId = setInterval(() => {

      setPattern(prev => {
        if (paths[0] === prev) {

          return paths[1]
        } 

        return paths[0]
      })
      

      // const randomIndex = Math.floor(Math.random() * svgArray.length);
      // setSvg(svgArray[randomIndex])
      // const getRandomSvg = () => {
      //     return svgArray[randomIndex];
      //   };

    }, 2000)

    return () => clearInterval(intervalId)

  }, [])

  return (
    <>
    {/* <div className={page.bg}></div> */}
    {/* <SvgArray className={page.background} interval={1000}/> */}
    {/* <div className={page.backgroundOverlay}></div> */}

      {/* <Container> */}
        <div
          className={page.container_descricao}
        >
          <main
            className={page.descricao}
            >
            <span className={page.span}>
              {/* <SvgArray className={page.logoHole} interval={1000}/> */}
              <LogoSvg />
              {/* <NoMatch /> */}
              
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
          
          <FatoresTable
            display={true}
            fatores={fatores}
            setFatores={updateFatoresAtuais}
            valor={valor}
            setValor={setValor}
            handleSubmit={adicionarValor}
            />
          </div>
        {/* <div className={page.container_tabela}>
        </div> */}
      {/* <div className='table-container'> */}
        <div 
          className={page.table}
          style={{ 
            background: `${controleProdutos.length > 0 ? '' : 'none'}`, 
            width: `${controleProdutos.length > 0 ? '' : '100%'}`,
          }}
        >  
          {/* <span
            className={page.scroll}
            ref={scrollRef}
            onClick={() => {
              if (scrollRef.current)
              scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start'})
            }}
          ></span> */}
        {controleProdutos.length > 0 &&
        <>
        <svg 
            className={page.scroll}
            ref={scrollRef}
            onClick={() => {
              if (scrollRef.current) {

                const rect = scrollRef.current.getBoundingClientRect()
                const viewportHeight: number = window.innerHeight

                scrollRef.current.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: `${(rect.top < viewportHeight / 2) ? 'end' : 'start'}`
                })
              }
            }}
            // onMouseEnter={() => setPattern("M0 199C78.5 199 238.5 269 238.5 377C238.5 485 259 487 259 377C259 267 402.5 199.5 500 199.5")}
            // onMouseLeave={() => setPattern("M0 276C78.5 276 123.995 454 246.5 454C359.5 454 130.5 454 261.5 454C384.577 454 402.5 276.5 500 276.5")}
          >
            <defs>
              <pattern id="pattern" patternUnits="userSpaceOnUse" width="50" height="50">
              <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={pattern} stroke="black" stroke-width="40"/>
              </svg>
              <rect width='100%' height='100%' fill='url(#pattern)'/>
            <svg className={page.down} fill="#000000" width="50px" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg>
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#pattern)'/>
            {/* <svg className={page.down} fill="#000000" width="50px" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg> */}
          </svg>
        <span className={input.header}>
          <span className={input.id}>
            <h1>#</h1>
            <h3>novo</h3>
          </span>
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
        </span> 
        </>
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
        {controleProdutos.length > 0 &&
        <button
          className={page.botao}
          onClick={() => handleSaveDB()}
          >
          Salvar Dados
        </button>
        }
        <Suspense fallback={<Loading/>}>
          <Link href='/cadastros' prefetch>
            <button className={page.botao}>Ver cadastros</button>
          </Link>
        </Suspense>
        {/* <button
          // onClick={() => handleSave()}
          onClick={() => handleReadDB()}
          >
          Ler Dados
        </button> */}
        </div>
      {/* </div> */}
    {/* </Container> */}
    </>
  )
}
