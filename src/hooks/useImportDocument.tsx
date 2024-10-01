import { useNotification } from "@/app/(app)/(contexts)/NotificationContext"
import { CTeData, NFeData, NFeProduto, parseCTeXml, parseNFeXml } from "@/utils/parseXml"
import { useState } from "react"

interface PedidoData extends NFeData, CTeData {}

export interface DadosImportados {

    pedido: PedidoData
    produtos: NFeProduto[]

}

export interface DocumentoImportado {

    fornecedor: string
    numero: string
    chave: string
    data: Date

}

// type parseXmlReturn = DadosImportados | { valorFrete: string | null | undefined, chaveNFe: string | null | undefined} | null

interface UseImportDocument {

    NFeLoading: boolean
    NFeImportado: DocumentoImportado | undefined
    CTeLoading: boolean
    CTeImportado: DocumentoImportado | undefined

    importNFe: (chave: string) => void
    importCTe: (chave: string) => void

    dadosImportados: DadosImportados

}

const INITAL_STATE_DADOS_IMPORTADOS: DadosImportados = {

    pedido: {
        fornecedor: "",
        cnpj: "",
        valorSt: "",
        valorTotalProdutos: "",
        valorFrete: "",
        chaveNFe: "",
        nNFe: "",
        transportador: "",
        nCTe: ""
    },
    
    produtos: []
}

export default function useImportDocument(): UseImportDocument {

    const [dadosImportados, setDadosImportados] = useState<DadosImportados>(INITAL_STATE_DADOS_IMPORTADOS)

    const [NFeLoading, setNFeLoading] = useState(false)
    const [NFeImportado, setNFeImportado] = useState<DocumentoImportado>()

    const [CTeLoading, setCTeLoading] = useState(false)
    const [CTeImportado, setCTeImportado] = useState<DocumentoImportado>()

    const { addNotification } = useNotification()

    const handleImportNFe = async (chave: string) => {

        if (chave.length < 44) {
            console.log('Chave nfe tem 44 digitos');
            return
        }

        setNFeLoading(true)

        const query: Response = await fetch(`/xml/api/getNFe?chave=${chave}`)
        const res = await query.json()

        if (query.status !== 200) {
            console.log(query);
            addNotification({
                tipo: 'erro',
                mensagem: `Ocorreu um erro durante a importação da NFe! erro: ${res}`
            })
            setNFeLoading(false)
            return
        }

        const extractData = parseNFeXml(res) as DadosImportados
      
        setDadosImportados(extractData)
        setNFeImportado({
            fornecedor: extractData.pedido.fornecedor,
            numero: extractData.pedido.nNFe,
            chave: chave,
            data: new Date(),
        })

        setNFeLoading(false)
        addNotification({
            tipo: 'sucesso',
            mensagem: 'NFe importada com sucesso!'
        })

        console.log(extractData);
        console.log(dadosImportados);

    }

    const handleImportCTe = async (chave: string) => {

        if (chave.length < 44) {
            console.log('Chave nfe tem 44 digitos');
            return
        }

        setCTeLoading(true)

        const query: Response = await fetch(`/xml/api/getCTe?chave=${chave}`)
        const res = await query.json()       
        
        if (query.status !== 200) {
            console.log(query);
            addNotification({
                tipo: 'erro',
                mensagem: `Ocorreu um erro durante a importação da CTe! erro: ${res}`
            })
            setCTeLoading(false)
            return
        }

        const extractData = parseCTeXml(res)
        setDadosImportados( prev => ({
            pedido: {
                ...prev.pedido,
                valorFrete: extractData.valorFrete
            },
            produtos: [...prev.produtos]
        }))

        setCTeImportado({
            fornecedor: extractData.transportador,
            numero: extractData.nCTe,
            chave: chave,
            data: new Date(),
        })

        setCTeLoading(false)
        addNotification({
            tipo: 'sucesso',
            mensagem: 'CTe importada com sucesso!'
        })

        // Consulta NFe atrelada à CTe e importa seus dados
        handleImportNFe(extractData.chaveNFe)

        console.log(extractData);
        console.log(dadosImportados);

    }


    return {

        NFeLoading,
        NFeImportado,
        CTeLoading,
        CTeImportado,

        importNFe: handleImportNFe,
        importCTe: handleImportCTe,

        dadosImportados

    }

}