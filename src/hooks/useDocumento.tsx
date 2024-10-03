import { useNotification } from "@/app/(app)/(contexts)/NotificationContext"
import { CTeData, NFeData, NFeProduto, parseCTeXml, parseNFeXml } from "@/utils/parseXml"
import { useMemo, useState } from "react"

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

export interface DocumentoData {

    documento: string
    chave: string
    setChave: (chave: string) => void
    loading: boolean
    importarDocumento: (chave: string) => void
    importado: DocumentoImportado | undefined

}

// type parseXmlReturn = DadosImportados | { valorFrete: string | null | undefined, chaveNFe: string | null | undefined} | null

interface UseDocumento {

    documentos: Record<'nfe' | 'cte', DocumentoData>

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

export default function useDocumento(): UseDocumento {

    const [chaveNFe, setChaveNFe] = useState('')
    const [chaveCTe, setChaveCTe] = useState('')

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

    const documentos: Record<'nfe' | 'cte', DocumentoData> = useMemo(() => ({
        nfe: {
            documento: 'NFe',
            chave: chaveNFe,
            setChave: setChaveNFe,
            loading: NFeLoading,
            importarDocumento: handleImportNFe,
            importado: NFeImportado,
        } ,
        cte: {
            documento: 'CTe',
            chave: chaveCTe,
            setChave: setChaveCTe,
            loading: CTeLoading,
            importarDocumento: handleImportCTe,
            importado: CTeImportado,
        }
    }), [chaveNFe, NFeLoading, NFeImportado, chaveCTe, CTeLoading, CTeImportado])

    return {

        documentos,

        dadosImportados

    }

}