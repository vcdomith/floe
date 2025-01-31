import { DocumentoImportado } from "@/hooks/useDocumento"
import Converter from "./typeConversion"

export interface NFeData {

    fornecedor: string
    nNFe: string
    cnpj: string
    valorSt: string
    valorTotalProdutos: string

}

export interface CTeData {

    transportador: string
    nCTe: string
    valorFrete: string
    chaveCTe: string
    chaveNFe: string

}

export interface NFeProduto {

    codigo: string
    ean: string
    descricao: string
    ncm: string
    st: boolean
    unitario: string
    unitarioPedido: string
    total: string
    quantidade: string
    ipi: string
    desconto: string

}

export interface NFeResult {
    pedido: NFeData,
    produtos: NFeProduto[]
}

export interface ParseXmlResult {
    data: NFeResult | CTeData
    documento: DocumentoImportado
    node: Document
}

const SUPPORTED_DOCUMENTS = ['nfe', 'cte']

const { stringToFloat, floatToString } = Converter

export const parseNFeXml = (xml: Document): ParseXmlResult  => {

    const fornecedor = xml.querySelector('emit > xNome')?.textContent
    const nNFe = xml.querySelector('nNF')?.textContent
    const cnpj = xml.querySelector('emit > CNPJ')?.textContent
    const itens = xml.querySelectorAll('infNFe > det')
    const valorSt = xml.querySelector('vST')?.textContent
    const valorTotalProdutos = xml.querySelector('ICMSTot > vProd')?.textContent
    const chaveNFe = xml.querySelector('infProt > chNFe')?.textContent

    const fornecedorDataExtraido: NFeData = {
        fornecedor: fornecedor || '',
        nNFe: nNFe || '',
        cnpj: cnpj || "",
        valorSt: valorSt?.replace('.', ',') || "",
        valorTotalProdutos: valorTotalProdutos?.replace('.', ',') || "",
    }

    const produtosExtraidos: NFeProduto[] = []
    itens.forEach( item => {

        const codigo = item.querySelector('cProd')?.textContent || ''
        const ean = item.querySelector('cEAN')?.textContent || ''
        const descricao = item.querySelector('xProd')?.textContent || ''
        const ncm = item.querySelector('NCM')?.textContent || ''
        const st = item.querySelector('CST')?.textContent || ''
        const unitario = item.querySelector('vUnCom')?.textContent || ''
        const total = item.querySelector('vProd')?.textContent || ''
        const quantidade = item.querySelector('qCom')?.textContent || ''
        const ipi = item.querySelector('pIPI')?.textContent || ''

        const produto: NFeProduto = {
            codigo: codigo,
            ean: ean,
            descricao: descricao,
            ncm: ncm,
            st: (st === '10'),
            // unitario: unitario?.replace('.', ','),
            unitario: floatToString(parseFloat(unitario), 4),
            unitarioPedido: '',
            total: total?.replace('.', ','),
            quantidade: quantidade,
            ipi: ipi?.replace('.', ','),
            desconto: '',
        }

        produtosExtraidos.push(produto)

    })

    const data: NFeResult = {
        pedido: fornecedorDataExtraido,
        produtos: produtosExtraidos
    }

    const documento: DocumentoImportado = {
        tipo: 'nfe',
        fornecedor: fornecedor!,
        numero: nNFe!,
        chave: chaveNFe!,
        criadoEm: new Date(),
        data: data
    }

    return {
        data: data,
        documento: documento,
        node: xml,
    }

}

export const parseCTeXml = (xml: Document): ParseXmlResult  => {
        
    const transportador = xml.querySelector('emit > xNome')?.textContent
    const nCTe = xml.querySelector('nCT')?.textContent
    const valorFrete = xml.querySelector('vTPrest')?.textContent
    const chaveCTe = xml.querySelector('infProt > chCTe')?.textContent
    const chaveNFe = xml.querySelector('infNFe > chave')?.textContent

    const CTeData: CTeData = {
        valorFrete: valorFrete?.replace('.', ',') || '',
        chaveCTe: chaveCTe || '',
        chaveNFe: chaveNFe || '',
        transportador: transportador || "",
        nCTe: nCTe || ""
    }

    const documento: DocumentoImportado = {
        tipo: 'cte',
        fornecedor: transportador!,
        numero: nCTe!,
        chave: chaveCTe!,
        criadoEm: new Date(),
        data: CTeData
    }

    return {
        data: CTeData,
        documento: documento,
        node: xml,
    }


}

export const parseXml = (res: string): ParseXmlResult => {

    const parser = new DOMParser()
    const xml = parser.parseFromString(res, 'application/xhtml+xml')

    const tipo = xml.childNodes[0].nodeName.toLowerCase()

    console.log(tipo);
    console.log(tipo.includes('nfe'));
    console.log(tipo.includes('cte'));

    if (!tipo.includes('nfe') && !tipo.includes('cte')) {
        throw new Error('Documento não suportado, deve incluir nfeProc ou cteProc como primeiro node')
    }

    return (tipo.includes('nfe')) 
        ? parseNFeXml(xml)
        : parseCTeXml(xml)

    // switch (tipo) {

    //     case 'nfeProc':

    //         return parseNFeXml(xml)
    
    //     case 'cteProc':

    //         return parseCTeXml(xml)

    // }
        





}