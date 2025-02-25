import { useNotification } from "@/app/(app)/(contexts)/NotificationContext"
import { CTeData, NFeData, NFeProduto, NFeResult, parseXml } from "@/utils/parseXml"
import { Dispatch, SetStateAction, useMemo, useState } from "react"
import useChaveContext from "./useChaveContext"
import { IFornecedor } from "@/interfaces/IFornecedor"

interface PedidoData extends NFeData, CTeData {}

export interface DadosImportados {

    pedido: PedidoData
    produtos: NFeProduto[]

}

export interface DocumentoImportado {

    tipo: 'nfe' | 'cte' | 'pedido'
    fornecedor: string
    numero: string
    chave: string
    criadoEm: Date
    data: NFeResult | CTeData

}

export interface ProdutoPedido {

    codigo: string

    st: string
    unitario: string
    composto: string[]

    ipi: string
    desconto: string

}

export interface PedidoProdutosResult {

    valorTotalPedido: string

}

export interface DocumentoData {

    documento: string
    chave: string
    setChave: (chave: string) => void
    loading: boolean
    importarDocumento: (chave: string) => Promise<NFeResult | undefined>
    importado: DocumentoImportado | undefined

}

// type parseXmlReturn = DadosImportados | { valorFrete: string | null | undefined, chaveNFe: string | null | undefined} | null

export interface UseDocumento {

    chave: string
    setChave: Dispatch<SetStateAction<string>>
    loading: boolean
    valid: boolean
    documentos: Documentos
    setDocumento: (documento: DocumentoImportado) => void
    dadosImportados: DadosImportados

    modelo: string | null
    importarDocumento: (chave: string) => Promise<NFeResult | undefined>

    clearDocumento: () => void
    // documentos: Record<'nfe' | 'cte', DocumentoData>
    // getModeloDocumento: (chave: string) => string

    // dadosImportados: DadosImportados

}

const INITAL_STATE_DADOS_IMPORTADOS: DadosImportados = {

    pedido: {
        fornecedor: "",
        cnpj: "",
        valorSt: "",
        valorTotalProdutos: "",
        valorFrete: "",
        chaveNFe: "",
        chaveCTe: "",
        nNFe: "",
        transportador: "",
        nCTe: ""
    },
    
    produtos: []
}

interface Documentos {

    cte: DocumentoImportado | null
    nfe: DocumentoImportado | null
    pedido: DocumentoImportado | null

}

const INITIAL_DOCUMENTOS: Documentos = {
    cte: null,
    nfe: null,
    pedido: null
}

const SUPPORTED_MODELOS = ['55', '57']

export default function useDocumento(): UseDocumento {

    const [chave, setChave] = useState('')
    const [loading, setLoading] = useState(false)

    const [documentos, setDocumentos] = useState<Documentos>(INITIAL_DOCUMENTOS)
    const setDocumento = (documento: DocumentoImportado) => {
        setDocumentos(prev => ({
            ...prev,
            [documento.tipo]: documento
        }))
    }

    const modelo = useMemo(() => {

        if(chave.length !== 44) return null
        return chave.slice(20,22)

    }, [chave])

    const valid = useMemo(() => chave.length === 44, [chave])

    const [dadosImportados, setDadosImportados] = useState<DadosImportados>(INITAL_STATE_DADOS_IMPORTADOS)

    const { addNotification } = useNotification()

    const handleImportNFe = async (chave: string) => {

        if (chave.length < 44) {
            console.log('Chave nfe tem 44 digitos');
            return
        }

        setLoading(true)

        try {
            
            const query: Response = await fetch(`/xml/api/getNFe?chave=${chave}`)
            const res = await query.json()

            if (query.status !== 200) {
                console.log(query);
                addNotification({
                    tipo: 'erro',
                    mensagem: `Ocorreu um erro durante a importação da NFe! erro: ${res}`
                })
                setLoading(false)
                return
            }

            const extractData = parseXml(res)
        
            const { data } = extractData

            // setDadosImportados(extractData)
            setDadosImportados( prev => ({
                pedido: {
                    ...prev.pedido,
                    ...(extractData.data as NFeResult).pedido
                },
                produtos: [...(data as NFeResult).produtos]
            }))
            setDocumento({
                tipo: 'nfe',
                fornecedor: (data as NFeResult).pedido.fornecedor,
                numero: (data as NFeResult).pedido.nNFe,
                chave: chave,
                criadoEm: new Date(),
                data: data
            })

            setLoading(false)
            addNotification({
                tipo: 'sucesso',
                mensagem: 'NFe importada com sucesso!'
            })

            return (data as NFeResult)

        } catch (error) {
            
            console.error(error)

        }

        // console.log(extractData);
        // console.log(dadosImportados);

    }

    const handleImportCTe = async (chave: string) => {

        if (chave.length < 44) {
            console.log('Chave nfe tem 44 digitos');
            return
        }

        setLoading(true)

        try {
            
            const query: Response = await fetch(`/xml/api/getCTe?chave=${chave}`)
            const res = await query.json()       
            
            if (query.status !== 200) {
                console.log(query);
                addNotification({
                    tipo: 'erro',
                    mensagem: `Ocorreu um erro durante a importação da CTe! erro: ${res}`
                })
                setLoading(false)
                return
            }

            const extractData = parseXml(res)
            const { data } = extractData
            console.log('extractData', extractData);
            setDadosImportados( prev => ({
                pedido: {
                    ...prev.pedido,
                    ...data
                },
                produtos: [...prev.produtos]
            }))

            setDocumento({
                tipo: 'cte',
                fornecedor: (data as CTeData).transportador,
                numero: (data as CTeData).nCTe,
                chave: chave,
                criadoEm: new Date(),
                data: data
            })

            setLoading(false)
            addNotification({
                tipo: 'sucesso',
                mensagem: 'CTe importada com sucesso!'
            })

            // Consulta NFe atrelada à CTe e importa seus dados
            setChave((data as CTeData).chaveNFe)
            handleImportNFe((data as CTeData).chaveNFe)

        } catch (error) {
            
            console.error(error)

        }

        // console.log(extractData);
        // console.log(dadosImportados);

    }

    const importarDocumento = async (chave: string) => {
        
        if (!modelo) {
            console.log('documento não possui modelo ou não está validado corretamente, necessita ter 44 dígitos');
            return
        } 

        if (!SUPPORTED_MODELOS.includes(modelo)) {
            console.log('apenas documentos com modelos 55(nfe) ou 57(cte) são suportados');
            return
        }

        if (modelo === '57') {
            console.log('cte');
            await handleImportCTe(chave)
            return
        }

        console.log('nfe');
        const data = await handleImportNFe(chave)
        return data

    }

    const clearDocumento = () => {
        setChave('')
        setDadosImportados(INITAL_STATE_DADOS_IMPORTADOS)
        setDocumentos(INITIAL_DOCUMENTOS)
    }

    // const documentos: Record<'nfe' | 'cte', DocumentoData> = useMemo(() => ({
    //     nfe: {
    //         documento: 'NFe',
    //         chave: chaveNFe,
    //         setChave: setChaveNFe,
    //         loading: NFeLoading,
    //         importarDocumento: handleImportNFe,
    //         importado: NFeImportado,
    //     } ,
    //     cte: {
    //         documento: 'CTe',
    //         chave: chaveCTe,
    //         setChave: setChaveCTe,
    //         loading: CTeLoading,
    //         importarDocumento: handleImportCTe,
    //         importado: CTeImportado,
    //     }
    // }), [chaveNFe, NFeLoading, NFeImportado, chaveCTe, CTeLoading, CTeImportado])

    return {

        chave,
        setChave,
        loading,
        valid,
        documentos,
        setDocumento,
        dadosImportados,
        modelo,
        importarDocumento,
        clearDocumento,
    }

}