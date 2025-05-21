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
    composto1: string
    composto2: string
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

const CODIGOS_ST = [
  // CSOSN (3 dígitos)
  '201', // Tributada com crédito e com ST
  '202', // Tributada sem crédito e com ST
  '203', // Isenção com ST
  '500', // ICMS cobrado anteriormente por ST
  '900', // Outros (pode envolver ST, depende de vICMSST)

  // CST (3 dígitos)
  '010', // Tributada com ST
  '030', // Isenta ou não tributada com ST
  '060', // ICMS cobrado anteriormente por ST
  '070', // Com redução de base e com ST

  // CFOP (4 dígitos) — operações com ST
  '1201', // Compra para industrialização com ST retido
  '1202', // Compra para industrialização com ST
  '1203', // Compra para comercialização com ST
  '1403', // Devolução de mercadoria com ST
  '2401', '2403', // Transferência/Compra com ST
  '5401', '5402', '5403', '5405', // Vendas com ST
  '6401', '6403', '6404', '6405', // Vendas com ST para fora do estado
];


const SUPPORTED_DOCUMENTS = ['nfe', 'cte']

const { stringToFloat, floatToString } = Converter

export const parseNFeXml = (xml: Document): ParseXmlResult  => {

    const fornecedor = xml.querySelector('emit > xNome')?.textContent
    const regimeTributario = xml.querySelector('emit > CRT')?.textContent || ''
    const simplesNacional = regimeTributario === '1' || regimeTributario === '2'
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
        const csosn = item.querySelector('CSOSN')?.textContent || ''
        const cst = item.querySelector('CST')?.textContent || ''
        const st = simplesNacional ? csosn : cst
        const unitario = item.querySelector('vUnCom')?.textContent || ''
        const total = item.querySelector('vProd')?.textContent || ''
        const quantidade = item.querySelector('qCom')?.textContent || ''
        const ipi = item.querySelector('pIPI')?.textContent || ''

        console.log(st, CODIGOS_ST.includes(st));

        const produto: NFeProduto = {
            codigo: codigo,
            ean: ean,
            descricao: descricao,
            ncm: ncm,
            st: CODIGOS_ST.includes(st),
            // unitario: unitario?.replace('.', ','),
            unitario: floatToString(parseFloat(unitario), 4),
            unitarioPedido: '',
            composto1: '',
            composto2: '',
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