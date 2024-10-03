
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
    chaveNFe: string

}

export interface NFeProduto {

    codigo: string
    ean: string
    descricao: string
    ncm: string
    cst: string
    unitario: string
    total: string
    ipi: string

}

export const parseNFeXml = (res: string)  => {
   
    const parser = new DOMParser()
    const xml = parser.parseFromString(res, 'application/xml')

    const fornecedor = xml.querySelector('emit > xNome')?.textContent
    const nNFe = xml.querySelector('nNF')?.textContent
    const cnpj = xml.querySelector('emit > CNPJ')?.textContent
    const itens = xml.querySelectorAll('infNFe > det')
    const valorSt = xml.querySelector('vST')?.textContent
    const valorTotalProdutos = xml.querySelector('ICMSTot > vProd')?.textContent

    const fornecedorDataExtraido: NFeData = {
        fornecedor: fornecedor || '',
        nNFe: nNFe || '',
        cnpj: cnpj || "",
        valorSt: valorSt || "",
        valorTotalProdutos: valorTotalProdutos || "",
    }

    const produtosExtraidos: NFeProduto[] = []
    itens.forEach( item => {

        const codigo = item.querySelector('cProd')?.textContent || ''
        const ean = item.querySelector('cEAN')?.textContent || ''
        const descricao = item.querySelector('xProd')?.textContent || ''
        const ncm = item.querySelector('NCM')?.textContent || ''
        const cst = item.querySelector('CST')?.textContent || ''
        const unitario = item.querySelector('vUnCom')?.textContent || ''
        const total = item.querySelector('vProd')?.textContent || ''
        const ipi = item.querySelector('pIPI')?.textContent || ''

        const produto: NFeProduto = {
            codigo: codigo,
            ean: ean,
            descricao: descricao,
            ncm: ncm,
            cst: cst,
            unitario: unitario,
            total: total,
            ipi: ipi,
        }

        produtosExtraidos.push(produto)

    })

    return {
        pedido: fornecedorDataExtraido,
        produtos: produtosExtraidos
    }

}

export const parseCTeXml = (res: string)  => {
   
    const parser = new DOMParser()
    const xml = parser.parseFromString(res, 'application/xml')
        
    const transportador = xml.querySelector('emit > xNome')?.textContent
    const nCTe = xml.querySelector('nCT')?.textContent
    const valorFrete = xml.querySelector('vTPrest')?.textContent
    const chaveNFe = xml.querySelector('infNFe > chave')?.textContent

    const CTeData: CTeData = {
        valorFrete: valorFrete || '',
        chaveNFe: chaveNFe || '',
        transportador: transportador || "",
        nCTe: nCTe || ""
    }

    return CTeData


}
