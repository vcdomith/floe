'use client'
import Link from 'next/link'
import style from './ImportarChaveSection.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import { ChangeEvent, KeyboardEvent, MouseEvent, useMemo, useRef, useState } from 'react'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import Highlight from '@/components/Highlight/Highlight'
import { m } from 'framer-motion'

interface NfeData {

    fornecedor: string
    cnpj: string
    valorSt: string
    valorTotalProdutos: string
    valorFrete: string

}

interface NfeProduto {

    codigo: string
    ean: string
    descricao: string
    ncm: string
    cst: string
    unitario: string
    ipi: string

}

interface NFeDadosImportados {

    pedido: NfeData
    produtos: NfeProduto[]

}

interface FatoresSectionProps {

    fornecedores: string[] | undefined

}

type parseXmlReturn = NFeDadosImportados | { valorFrete: string | null | undefined } | null

const parseXml = (res: string): parseXmlReturn  => {
   
    const parser = new DOMParser()
    const xml = parser.parseFromString(res, 'application/xml')

    switch (xml.firstElementChild?.nodeName) {

        case 'nfeProc':

            const fornecedor = xml.querySelector('emit > xNome')?.textContent
            const cnpj = xml.querySelector('emit > CNPJ')?.textContent
            const itens = xml.querySelectorAll('infNFe > det')
            const valorSt = xml.querySelector('vST')?.textContent
            const valorTotalProdutos = xml.querySelector('ICMSTot > vProd')?.textContent
        
            const fornecedorDataExtraido: NfeData = {
                fornecedor: fornecedor || '',
                cnpj: cnpj || "",
                valorSt: valorSt || "",
                valorTotalProdutos: valorTotalProdutos || "",
                valorFrete: '',
            }
        
            const produtosExtraidos: NfeProduto[] = []
            itens.forEach( item => {
        
                const codigo = item.querySelector('cProd')?.textContent || ''
                const ean = item.querySelector('cEAN')?.textContent || ''
                const descricao = item.querySelector('xProd')?.textContent || ''
                const ncm = item.querySelector('NCM')?.textContent || ''
                const cst = item.querySelector('CST')?.textContent || ''
                const unitario = item.querySelector('vUnCom')?.textContent || ''
                const ipi = item.querySelector('pIPI')?.textContent || ''
        
                const produto = {
                    codigo: codigo,
                    ean: ean,
                    descricao: descricao,
                    ncm: ncm,
                    cst: cst,
                    unitario: unitario,
                    ipi: ipi,
                }
        
                produtosExtraidos.push(produto)
        
            })
        
            return {
                pedido: fornecedorDataExtraido,
                produtos: produtosExtraidos
            }

        case 'cteProc':
            
            const valorFrete = xml.querySelector('vTPrest')?.textContent

            return {
                valorFrete: valorFrete
            }
    
        default:

            return null
    }

}

const INITAL_STATE_DADOS_IMPORTADOS: NFeDadosImportados = {
    pedido: {
        fornecedor: "",
        cnpj: "",
        valorSt: "",
        valorTotalProdutos: "",
        valorFrete: ""
    },
    produtos: []
}

export default function ImportarChaveSection() {

    const [chaveNFe, setChaveNFe] = useState('')
    const [chaveCTe, setChaveCTe] = useState('')

    const [dadosImportados, setDadosImportados] = useState<NFeDadosImportados>(INITAL_STATE_DADOS_IMPORTADOS)


    const handleImportNFe = async (chave: string) => {

        // const innerChave = chave

        if (chave.length < 44) {
            console.log('Chave nfe tem 44 digitos');
            return
        }

        const res = await fetch(`/xml/api/getNFe?chave=${chave}`)
        const cert = await res.json()

        const extractData = parseXml(cert) as NFeDadosImportados
        // setDadosImportados(() => ({
        //     pedido: {...extractData.pedido},
        //     produtos: [...extractData.produtos]
        // }))
        setDadosImportados(extractData)
        console.log(extractData);
        console.log(dadosImportados);
        

    }

    return (

        <section className={style.chaveSection}>
            
            <div className={style.content}>
                
                <div className={style.title}>
                    <span className={style.header}>
                        <Link href={'/calcular'}>
                            {svgsUtil.back}
                        </Link>
                        <h3>Importar NFe e CTe</h3>
                    </span>
                    <p>Forneça a chave de acesso da Nfe com 44 dígitos para importar os valores da nota:</p>

                    <ImportCard 
                        document={'CTe'} 
                        value={chaveCTe} 
                        setValue={setChaveCTe} 
                        handleClick={() => handleImportNFe(chaveNFe)} 
                    />

                    <ImportCard 
                        document={'NFe'} 
                        value={chaveNFe} 
                        setValue={setChaveNFe} 
                        handleClick={() => handleImportNFe(chaveNFe)} 
                    />

                    {/* <input type="text" minLength={44} maxLength={44} value={chaveNFe} onChange={(e) => setChaveNFe(e.target.value)}/>
                    <button 
                        onClick={() => handleImportNFe(chaveNFe)}
                    >Importar NFe</button> */}

                    {/* <input type="text" pattern={'[0-9]*'} minLength={44} maxLength={44} value={chaveCTe} onChange={(e) => setChaveCTe(e.target.value)}/>
                    <button 
                        // onClick={() => handleImportCTe(chaveCTe)}
                    >Importar CTe</button> */}

                    <button>Gerar Tabela!</button>

                </div>

            </div>

        </section>

    )

}

interface ImportCardProps {

    document: 'NFe' | 'CTe'
    value: string
    setValue: (value: string) => void
    handleClick: () => void

}

interface Caret {
    start: number,
    end: number,
    direction: 'none' | 'foward' | 'backward'
}

const CARET_INITIAL_STATE: Caret = {
    start: -1,
    end: -1,
    direction: 'none'
}

const ImportCard = ( {document, value, setValue, handleClick}: ImportCardProps ) => {

    const chaveFixedLength = useMemo(() => {
        let newString = value
        while (newString.length < 44) {
            newString += '_'
        }
        return newString
    }, [value])

    const valid = useMemo(() => {
        return value.length === 44
    }, [value])

    const splitChave = useMemo(() => {
        return chaveFixedLength.match(/.{1,4}/g)
    }, [chaveFixedLength])

    const [caret, setCaret] = useState(CARET_INITIAL_STATE)

    const inputRef = useRef<HTMLInputElement>(null)

    const handleCaretEvent = () => {
        if (inputRef.current) {

            const start = inputRef.current?.selectionStart!
            const end = inputRef.current?.selectionEnd!
            const direction = (inputRef.current?.selectionDirection! as 'none' | 'foward' | 'backward')
            console.log({ start, end, direction });

            setCaret({ start, end, direction })

        }
    }

    const resetCaret = () => {
        setCaret(CARET_INITIAL_STATE)
    }

    const handleInputChange = (e: 
        ChangeEvent<HTMLInputElement> ) => {

        if (/^[0-9]*$/.test(e.target.value)) {
            setValue(e.target.value)
            handleCaretEvent()
        }

    }

    const handleDigitClick = (index: number) => {

        if (inputRef.current) {

            if (index <= value.length) {
                    
                inputRef.current.focus()
                inputRef.current.setSelectionRange((index + 1), (index + 1))
    
                setCaret({
                    start: index,
                    end: index,
                    direction: 'foward',
                })
    
                return
            }
    
            inputRef.current.focus()
            inputRef.current.setSelectionRange(value.length + 1, value.length + 1)

            setCaret({
                start: value.length,
                end: value.length,
                direction: 'foward',
            })
        }

        
    }

    const selection = useMemo(() => caret.end !== caret.start,[caret])

    return (
        <div className={style.importCard}>

            <span className={style.badge}>
                {svgsUtil.unitarioNota}
                <p>Importar valores da NFe através da chave</p>
                {/* <button onClick={() => handleClick()}>Importar {document}</button> */}
            </span>

            <span className={style.input}>
                {/* <input 
                    type="text" 
                    minLength={44} 
                    maxLength={44}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                /> */}
                <div className={style.format}>
                    <input 
                        className={style.input}
                        type="text" 
                        minLength={44} 
                        maxLength={44}
                        value={value}
                        onChange={(e) => handleInputChange(e)}
                        onClick={() => handleCaretEvent()}
                        onKeyUp={() => handleCaretEvent()}
                        onBlur={() => resetCaret()}

                        ref={inputRef}
                        // disabled={valid}
                    />
                    <span className={style.segments}>
                        {splitChave?.map( (segment, indexSegment) => 
                            <span className={style.segment} key={indexSegment}>
                                {segment.split('').map( (digit, indexDigit) => {

                                    const digitIndex = (indexSegment * 4) + indexDigit
 
                                    return (
                                        <div 
                                        key={indexDigit}
                                        className={style.digit}
                                        data-active={
                                            selection 
                                                ? (digitIndex >= caret.start && digitIndex < caret.end )
                                                : (digitIndex === caret.end)
                                        }
                                        data-caret={selection ? false : digitIndex === caret.end}
                                        onClick={() => handleDigitClick(digitIndex)}
                                    >{digit}</div>
                                    )
                                })}
                            </span>
                        )}
                        {/* <button>{'>'}</button> */}
                    </span>
                </div>
            </span>

            <button 
                className={style.button}
                disabled={!valid}
            >Importar NFe</button>

        </div>
    )

}