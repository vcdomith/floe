'use client'
import Link from 'next/link'
import style from './ImportarChaveSection.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import { useState } from 'react'

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

                    <input type="text" minLength={44} maxLength={44} value={chaveNFe} onChange={(e) => setChaveNFe(e.target.value)}/>
                    <button 
                        onClick={() => handleImportNFe(chaveNFe)}
                    >Importar NFe</button>

                    <input type="text" minLength={44} maxLength={44} value={chaveCTe} onChange={(e) => setChaveCTe(e.target.value)}/>
                    <button 
                        // onClick={() => handleImportCTe(chaveCTe)}
                    >Importar CTe</button>

                    <button>Gerar Tabela!</button>

                </div>

            </div>

        </section>

    )

}