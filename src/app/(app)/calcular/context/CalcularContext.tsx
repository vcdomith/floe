'use client'
import useFornecedor, { useFornecedorReturn } from "@/hooks/useFornecedor";
import usePedido, { usePedidoReturn } from "@/hooks/usePedido";
import useProduto, { useProdutoReturn } from "@/hooks/useProduto";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../(contexts)/NotificationContext";
import { IFator } from "@/interfaces/IFator";
import useFilter, { useFilterReturn } from "@/hooks/useFilter";
import { dbConnect } from "@/utils/db/supabase";

interface CalcularContextProps {

    fornecedorContext: useFornecedorReturn
    pedidoContext: usePedidoReturn
    produtoContext: useProdutoReturn
    displayControl: IDisplayControl 
    produtoIsValid: boolean
    tabelaValid: boolean
    tabela: produtoCadastro[]
    setTabela: Dispatch<SetStateAction<produtoCadastro[]>>
    cadastrarPedidoDB: () => Promise<void>
    filterContext: useFilterReturn

    submitForm: () => void

}

interface fatoresContext {

    base: string
    fatorBaseNormal: string
    fatorBaseST: string

    transporte: string
    st: string

    ipi: string
    desconto: string 

}

export interface produtoCadastro {

    id: number
    codigo: string
    ncm: string
    
    st: boolean
    unitario: string
    unitarioNota: string
    composto: string[] | null

    fatores: fatoresContext

}

interface IDisplayControl {

    fatorTransportePedido: boolean
    fatorSTPedido: boolean
    ncm: boolean
    desconto: boolean
    ipi: boolean
    unitarioPedido: boolean
    unitarioNota: boolean
    unitarioComposto: boolean

}

export const CalcularContext = createContext<CalcularContextProps | undefined>(undefined)
CalcularContext.displayName = 'Calcular'

export const useCalcular = () => {
    const context = useContext(CalcularContext)
    if (!context) throw new Error('useCalcular must be used within a CalcularProvider')
    return context
}

export const CalcularProvider = ({ children }: { children: React.ReactNode}) => {

    const {notifications, addNotification} = useNotification()

    const supabase = dbConnect()

    const fornecedorContext = useFornecedor()
    const pedidoContext = usePedido()
    const produtoContext = useProduto()
    const filterContext = useFilter()

    // TABELA CONTEXT _ TODO

    const {fornecedorData} = fornecedorContext
    const {pedidoData} = pedidoContext
    const {produtoData, resetForm, codigoInputRef} = produtoContext
    const { setSearchParam } = filterContext

    type ControlledInputDataKeys = keyof typeof controlledInputData;
    const controlledInputData = useMemo(() => {
        return {...fornecedorData, ...pedidoData, ...produtoData}
    }, [fornecedorData, pedidoData, produtoData])

    const [tabela, setTabela] = useState<produtoCadastro[]>([])

    // Quando implementar tabela esse estado será o estado tabelaContext: produtoCadastro[]
    // const [produtoCadastros, setProdutoCadastros] = useState<produtoCadastro>() 

    type DisplayControlKeys = typeof displayControl;
    const displayControl: IDisplayControl = (produtoData.st)
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
            ipi: false,

            // unitarioNota: (fornecedorData.usaComposto) ? true : fornecedorData.usaUnitarioPedido,
            unitarioNota: true,
            unitarioPedido: (fornecedorData.usaUnitarioPedido && !fornecedorData.usaComposto), 
            unitarioComposto: (fornecedorData.usaUnitarioPedido && fornecedorData.usaComposto),

        }

    // const validKeys = Object.fromEntries(Object.entries(displayControl).filter( item => item[1] ))                               
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

    // console.log(validKeys);
    // console.table(check)

    const produtoIsValid = useMemo(() => {
        return Object.values(produtoValuesToCheck).every( value => value !== '' )
    }, [produtoValuesToCheck])

    // console.table(produtoValuesToCheck);
    // console.table(produtoIsValid);

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

        let produto: produtoCadastro = {
            
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
        
                // transporte: controlledInputData.fatorTransportePedido || '1',
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
        setTabela( prev => ([...prev, produto]) )
        resetForm()
        codigoInputRef.current.focus()

    }

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
            displayControl,
            produtoIsValid,
            tabela,
            tabelaValid,
            setTabela,
            submitForm,
            cadastrarPedidoDB,
            filterContext
        }}
    >
        {children}
    </CalcularContext.Provider>

}