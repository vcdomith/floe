'use client'
import useFornecedor, { UseFornecedor } from "@/hooks/useFornecedor";
import usePedido, { IFatoresPedido, UsePedido } from "@/hooks/usePedido";
import useProduto, { UseProduto } from "@/hooks/useProduto";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../(contexts)/NotificationContext";
import useFilter, { UseFilter } from "@/hooks/useFilter";
import { dbConnect } from "@/utils/db/supabase";
import useTabela, { UseTabela } from "@/hooks/useTabela";


export interface CalcularContext {

    fornecedorContext: UseFornecedor
    pedidoContext: UsePedido
    produtoContext: UseProduto
    getDisplayControl: (st: boolean) => IDisplayControl
    displayControl: IDisplayControl 
    produtoIsValid: boolean

    tabelaValid: boolean
    tabelaContext: UseTabela
    updateFatoresTabela: () => void
    cadastrarPedidoDB: () => Promise<void>
    filterContext: UseFilter
    
    submitForm: () => void
    resetContext: () => void

    calcularSection: 'Fatores' | 'Tabela'
    setCalcularSection : Dispatch<SetStateAction<"Fatores" | "Tabela">>

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

    id: number
    codigo: string
    ncm: string
    
    st: boolean
    unitario: string
    unitarioNota: string
    composto: string[]

    fatores: FatoresContext

}

export interface IDisplayControl {

    fatorTransportePedido: boolean
    fatorSTPedido: boolean
    ncm: boolean
    desconto: boolean
    ipi: boolean
    unitarioPedido: boolean
    unitarioNota: boolean
    unitarioComposto: boolean

}

const INITIAL_STATE_DIFF_CONTROL: DifferenceControl = {
    nome: false,
    fatorBase: false,
    fatorBaseNormal: false,
    fatorBaseST: false,
    usaTransporte: false,
    usaSt: false,
    usaDesconto: false,
    usaIpi: false,
    usaIpiUniversal: false,
    usaUnitarioPedido: false,
    usaComposto: false,
    usaNcm: false,
    quantidadeProdutos: false,
    fatorTransportePedido: false,
    valorFrete: false,
    fatorFrete: false,
    valorTotalProdutos: false,
    fatorSTPedido: false,
    valorST: false,
    multiploST: false,
    valorTotalProdutosST: false
}

export interface DifferenceControl extends Record<keyof IFornecedor, boolean>, Record<keyof IFatoresPedido, boolean> {}

export const CalcularContext = createContext<CalcularContext | undefined>(undefined)
CalcularContext.displayName = 'Calcular'

export const useCalcular = () => {
    const context = useContext(CalcularContext)
    if (!context) throw new Error('useCalcular must be used within a CalcularProvider')
    return context
}

export const CalcularProvider = ({ children }: { children: React.ReactNode }) => {

    const {addNotification} = useNotification()

    const supabase = dbConnect()

    const fornecedorContext = useFornecedor()
    const pedidoContext = usePedido()
    const produtoContext = useProduto()
    const filterContext = useFilter()
    const tabelaContext = useTabela()

    // TABELA CONTEXT _ TODO
    const [calcularSection, setCalcularSection] = useState<'Fatores' | 'Tabela'>('Fatores')

    const {fornecedorData, resetFornecedor, resetFornecedorControl} = fornecedorContext
    const {pedidoData, resetPedido, resetPedidoControl} = pedidoContext
    const {produtoData, resetForm, codigoInputRef} = produtoContext
    const { setSearchParam } = filterContext

    type ControlledInputDataKeys = keyof typeof controlledInputData;
    const controlledInputData = useMemo(() => {
        return {...fornecedorData, ...pedidoData, ...produtoData}
    }, [fornecedorData, pedidoData, produtoData])

    const {
        tabela,
        setTabela,
        adicionarProduto,
        removeProduto,
        updateProdutoTabela,
        updateFatoresTabela: updateFatoresTabelaInner,
        resetTabela,
    } = tabelaContext

    const updateFatoresTabela = () => updateFatoresTabelaInner(fornecedorData, pedidoData)

    const resetContext = () => {

        resetFornecedor()
        resetFornecedorControl()
        
        resetPedido()
        resetPedidoControl()

        resetForm()
        resetTabela()
    }

    type DisplayControlKeys = typeof displayControl;
    const getDisplayControl = (st: boolean = produtoData.st): IDisplayControl => (st)
        ? {

            fatorTransportePedido: fornecedorData.usaTransporte,
            fatorSTPedido: fornecedorData.usaSt,
            ncm: pedidoData.usaNcm,
            desconto: fornecedorData.usaDesconto,
            ipi: fornecedorData.usaIpi,

            // unitarioNota: (fornecedorData.composto) ? true : fornecedorData.unitarioNota,
            unitarioNota: true,
            unitarioPedido: (fornecedorData.usaUnitarioPedido && !fornecedorData.usaComposto), 
            unitarioComposto: (fornecedorData.usaUnitarioPedido && fornecedorData.usaComposto),

        }
        : {

            fatorTransportePedido: false,
            fatorSTPedido: false,
            ncm: pedidoData.usaNcm,
            desconto: fornecedorData.usaDesconto,
            ipi: fornecedorData.usaIpiUniversal,

            // unitarioNota: (fornecedorData.usaComposto) ? true : fornecedorData.usaUnitarioPedido,
            unitarioNota: true,
            unitarioPedido: (fornecedorData.usaUnitarioPedido && !fornecedorData.usaComposto), 
            unitarioComposto: (fornecedorData.usaUnitarioPedido && fornecedorData.usaComposto),

        }
                              
    const displayControl = getDisplayControl()
    const validKeys = Object.keys(displayControl)
                        .filter( key => displayControl[key as keyof DisplayControlKeys] )

    interface BaseCheck {
        
        quantidadeProdutos: string

        codigo: string
    
        fatorBase: string
        fatorBaseNormal: string
        fatorBaseST: string 

        [key: string]: any
        
    }

    const produtoValuesToCheck = useMemo(() => {

        const baseCheck: BaseCheck = {
            
            quantidadeProdutos: pedidoData.quantidadeProdutos,

            codigo: produtoData.codigo,
    
            fatorBase: fornecedorData.fatorBase,
            fatorBaseNormal: fornecedorData.fatorBaseNormal,
            fatorBaseST: fornecedorData.fatorBaseST,   
        }

        validKeys.map((key) => {
            baseCheck[key] = controlledInputData[key as ControlledInputDataKeys]
        })

        return baseCheck

    }, [fornecedorData, produtoData, pedidoData, validKeys, controlledInputData])

    const produtoIsValid = useMemo(() => {
        return Object.values(produtoValuesToCheck).every( value => value !== '' )
    }, [produtoValuesToCheck])

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

    const submitForm = () => {

        let produto: ProdutoCadastro = {
            
            id: new Date().getTime(),
            codigo: controlledInputData.codigo,
            ncm: controlledInputData.ncm || '',
            st: controlledInputData.st,
            unitario: unitario || '0',
            unitarioNota: controlledInputData.unitarioNota || '0',
            composto: [

                controlledInputData.composto1 || '', 
                controlledInputData.composto2 || '',

            ],
            fatores: {

                base: controlledInputData.fatorBase || '1',
                fatorBaseNormal: (!controlledInputData.st) ? controlledInputData.fatorBaseNormal : '1',
                fatorBaseST: (controlledInputData.st) ? controlledInputData.fatorBaseST : '1',
        
                transporte: (controlledInputData.st) 
                    ? controlledInputData.fatorTransportePedido || '1'
                    : '1',
                st: (controlledInputData.st) 
                    ? controlledInputData.fatorSTPedido || '1'
                    : '1',
                ipi: controlledInputData.ipi || '1',
                desconto: controlledInputData.desconto || '1',

            }
        }

        if(!produtoIsValid) {
            addNotification({tipo: 'erro', mensagem: 'Não foi possível adicionar o produto na tabela, preencha todos os dados!'}) 
            return
        } 
        
        if(tabelaValid) {
            addNotification({tipo: 'erro', mensagem: `Não foi possível adicionar o produto na tabela, limite de ${pedidoData.quantidadeProdutos} produtos atingido!`}) 
            return
        } 

        setSearchParam('')
        adicionarProduto(produto)
        resetForm()
        codigoInputRef?.current?.focus()

    }

    // Transformar em API Handler
    const cadastrarPedidoDB = async () => {

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
            
            // TODO transformar em API Handler
            const { data , error } = await supabase
                .from('cadastros')
                .insert({
                    fornecedor: fornecedorData.nome,
                    produtos: tabela
                })

            addNotification({
                tipo: 'sucesso',
                mensagem: 'Cadastro realizado com sucesso!'
            })

        } catch (error) {
            
            addNotification({
                tipo: 'erro',
                mensagem: JSON.stringify(error)
            })

        }

    }

    return <CalcularContext.Provider
        value={{
            fornecedorContext,
            pedidoContext,
            produtoContext,
            getDisplayControl,
            displayControl,
            produtoIsValid,

            tabelaValid,
            tabelaContext,
            updateFatoresTabela,
            cadastrarPedidoDB,
            filterContext,

            submitForm,
            resetContext,

            calcularSection,
            setCalcularSection,
        }}
    >
        {children}
    </CalcularContext.Provider>

}