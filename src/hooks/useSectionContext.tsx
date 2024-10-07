import { Dispatch, SetStateAction, useMemo, useState } from "react"
import useContextControl, { ContextControl, ControlledInputData, IDisplayControl, UseContextControl } from "./useContextControl"
import useFilter, { UseFilter } from "./useFilter"
import useFornecedor, { UseFornecedor } from "./useFornecedor"
import usePedido, { UsePedido } from "./usePedido"
import useProduto, { IProdutoContext, UseProduto } from "./useProduto"
import useTabela, { UseTabela } from "./useTabela"
import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext"

export interface UseSectionContext {

    fornecedorContext: UseFornecedor
    pedidoContext: UsePedido
    produtoContext: UseProduto
    tabelaContext: UseTabela
    filterContext: UseFilter
    contextControl: UseContextControl

    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>

    // updateFatoresTabela: () => void
    // cadastrarPedidoDB: () => Promise<void>
    
    // submitForm: () => void
    resetContext: () => void

    activeSection: 'Fatores' | 'Tabela'
    setActiveSection : Dispatch<SetStateAction<"Fatores" | "Tabela">>

    tabelaValid: boolean
    produtoValid: boolean

    controlledInputData: ControlledInputData
    unitario: string

}

export default function useSectionContext(): UseSectionContext {

    const fornecedorContext = useFornecedor()
    const pedidoContext = usePedido()
    const produtoContext = useProduto()
    const filterContext = useFilter()

    const context: ContextControl = useMemo(() => ({
        fornecedorCtx: fornecedorContext, 
        pedidoCtx: pedidoContext, 
        produtoCtx: produtoContext
    }), [fornecedorContext, pedidoContext, produtoContext])
    const tabelaContext = useTabela(context)

    const contextControl = useContextControl(context)
    const {controlledInputData, produtoValid} = useContextControl(context)
    const {fornecedorData, resetFornecedor, resetFornecedorControl} = fornecedorContext
    const {pedidoData, resetPedido, resetPedidoControl} = pedidoContext
    const {resetForm} = produtoContext

    const [activeSection, setActiveSection] = useState<'Fatores' | 'Tabela'>('Fatores')
    const [loading, setLoading] = useState(false)

    const {
        tabela,
        resetTabela,
    } = tabelaContext

    const resetContext = () => {

        resetFornecedor()
        resetFornecedorControl()
        
        resetPedido()
        resetPedidoControl()

        resetForm()
        resetTabela()
    }

    const tabelaValid = useMemo(() => {
        return tabela.length === parseInt(pedidoData.quantidadeProdutos)
    }, [tabela, pedidoData])

    const unitario = useMemo(() => {

        if (fornecedorData.usaComposto) 
            return controlledInputData.unitarioComposto
        else if (fornecedorData.usaUnitarioPedido) 
            return controlledInputData.unitarioPedido
        else 
            return controlledInputData.unitarioNota

    }, [fornecedorData, controlledInputData])

    // const createProduto = () => ({
            
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
    // })

    return {

        fornecedorContext,
        pedidoContext, 
        produtoContext,
        tabelaContext,
        filterContext,
        contextControl,
        resetContext,

        loading,
        setLoading,
        activeSection,
        setActiveSection, 

        tabelaValid,
        produtoValid,

        unitario,
        controlledInputData,
    }

}