'use client'
import { createContext, useContext, useMemo } from "react";
import { useNotification } from "../../(contexts)/NotificationContext";
import useSectionContext, { UseSectionContext } from "@/hooks/useSectionContext";
import { redirect, usePathname } from "next/navigation";
import useChaveContext, { UseChaveContext } from "@/hooks/useChaveContext";
import useManualContext, { UseManualContext } from "@/hooks/useManualContext";
import useXmlContext, { UseXmlContext } from "@/hooks/useXmlContext";
import { useModal } from "../../(contexts)/ModalContext";
import LogoSvg from "@/components/SvgArray/LogoSvg";

export interface CalcularContext {

    context:  UseChaveContext | UseManualContext | { context: UseSectionContext }
    contexts: Contexts
    
    submitForm: () => void
    cadastrarPedido: () => Promise<void>

}

export interface CalcContext {
    cadastrarPedido: () => void
}

export interface Contexts {
    chave: UseChaveContext
    manual: UseManualContext
    base: { context: UseSectionContext }
}

export interface FatoresContext {

    base: string
    fatorBaseNormal: string
    fatorBaseST: string

    transporte: string
    st: string

    ipi: string
    desconto: string 

}

export interface ProdutoCadastro {

    id: string
    codigo: string
    ncm: string
    
    st: boolean
    unitario: string
    unitarioNota: string
    composto: string[]

    fatores: FatoresContext

}

const VALID_CONTEXTS = ['chave', 'manual']
// export interface DifferenceControl extends Record<keyof IFornecedor, boolean>, Record<keyof IFatoresPedido, boolean> {}

export const CalcularContext = createContext<CalcularContext | undefined>(undefined)
CalcularContext.displayName = 'Calcular'

export const useCalcular = () => {
    const context = useContext(CalcularContext)
    if (!context) throw new Error('useCalcular must be used within a CalcularProvider')
    return context
}

//Um hook para cada section, evitando ter de calcular qual usar

export const useChave = () => {
    const context = useContext(CalcularContext)
    if (!context) throw new Error('useCalcular must be used within a CalcularProvider')
    const { contexts: { chave }, cadastrarPedido } = context
    return { chave, cadastrarPedido } 
}

export const useManual = () => {
    const context = useContext(CalcularContext)
    if (!context) throw new Error('useCalcular must be used within a CalcularProvider')
    const { contexts: { manual }, cadastrarPedido } = context
    return { manual, cadastrarPedido } 
}

export const CalcularProvider = ({ children }: { children: React.ReactNode }) => {

    const {addNotification} = useNotification()
    const path = usePathname().split('/')[2] as keyof Contexts | undefined

    const chaveContext = useChaveContext()
    const manualContext = useManualContext()
    const baseContext = useSectionContext()

    const {clearModal} = useModal()

    const contexts: Contexts = useMemo(() => ({
        chave: chaveContext,
        manual: manualContext,
        base: { context: baseContext }
    }), [chaveContext, manualContext, baseContext])

    const context = useMemo(() => {
        if(path === undefined || !VALID_CONTEXTS.includes(path)) {
            return contexts.base
            // redirect('calcular/chave')
            // throw new Error(`useCalcular must be used within a CalcularProvider and within supported routes: ${VALID_CONTEXTS}`)
        }
        return contexts[path]
    }, [contexts, path])

    const submitForm = () => {

        // const {
        //     pedidoContext: { pedidoData },
        //     produtoContext: { resetForm, codigoInputRef },
        //     filterContext: { setSearchParam },
        //     tabelaContext: { adicionarProduto },
        //     produtoValid,
        //     tabelaValid,
        //     unitario,
        //     controlledInputData,
        // } = context

        // if(!produtoValid) {
        //     addNotification({tipo: 'erro', mensagem: 'Não foi possível adicionar o produto na tabela, preencha todos os dados!'}) 
        //     return
        // } 
        
        // if(tabelaValid) {
        //     addNotification({tipo: 'erro', mensagem: `Não foi possível adicionar o produto na tabela, limite de ${pedidoData.quantidadeProdutos} produtos atingido!`}) 
        //     return
        // } 

        // let produto: ProdutoCadastro = {
            
        //     id: new Date().getTime(),
        //     codigo: controlledInputData.codigo,
        //     ncm: controlledInputData.ncm || '',
        //     st: controlledInputData.st,
        //     unitario: unitario || '0',
        //     unitarioNota: controlledInputData.unitarioNota || '0',
        //     composto: [

        //         controlledInputData.composto1 || '', 
        //         controlledInputData.composto2 || '',

        //     ],
        //     fatores: {

        //         base: controlledInputData.fatorBase || '1',
        //         fatorBaseNormal: (!controlledInputData.st) ? controlledInputData.fatorBaseNormal : '1',
        //         fatorBaseST: (controlledInputData.st) ? controlledInputData.fatorBaseST : '1',
        
        //         transporte: (controlledInputData.st) 
        //             ? controlledInputData.fatorTransportePedido || '1'
        //             : '1',
        //         st: (controlledInputData.st) 
        //             ? controlledInputData.fatorSTPedido || '1'
        //             : '1',
        //         ipi: controlledInputData.ipi || '1',
        //         desconto: controlledInputData.desconto || '1',

        //     }
        // }

        // setSearchParam('')
        // adicionarProduto(produto)
        // resetForm()
        // codigoInputRef?.current?.focus()

    }

    const cadastrarPedido = async () => {

        const { context: activeContext, resetContext } = context as (UseManualContext | UseChaveContext)

        console.log(context);

        const useDocumento = path === 'chave'

        const {
            pedidoContext: { pedidoData },
            fornecedorContext: { fornecedorData },
            tabelaContext: { tabela },
            setLoading,
        } = activeContext
        
        if (tabela.length === 0) {
            addNotification({
                tipo: 'erro',
                mensagem: 'Não é possível cadastrar um pedido vazio!'
            })
        }

        if (tabela.length !== parseInt(pedidoData.quantidadeProdutos)) {
            addNotification({
                tipo: 'erro',
                mensagem: `Não é possível cadastrar o pedido, são necessários ${pedidoData.quantidadeProdutos} produtos!`
            })
        }

        try {
            
            setLoading(true)

            const response: Response = await fetch('/calcular/api/cadastrarPedido', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    fornecedor: fornecedorData.nome,
                    produtos: tabela,
                    documentos: useDocumento 
                        ? (context as UseChaveContext).documentosContext.documentos 
                        : null
                })
            })

            const json: Response = await response.json()

            if (!response.ok) {
                addNotification({
                    tipo: 'erro',
                    mensagem: JSON.stringify(json)
                })
                return
            }

            setLoading(false)
            resetContext()
            addNotification({
                tipo: 'sucesso',
                mensagem: 'Cadastro realizado com sucesso!'
            })

        } catch (error) {
            
            setLoading(false)
            addNotification({
                tipo: 'erro',
                mensagem: JSON.stringify(error)
            })

        }

        setLoading(false)
        clearModal()

    }

    return <CalcularContext.Provider
        value={{
            context,
            contexts,
            submitForm,
            cadastrarPedido,
        }}
    >
        {children}
    </CalcularContext.Provider>

}