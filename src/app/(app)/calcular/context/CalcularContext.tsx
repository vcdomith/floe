'use client'
import useFornecedor, { useFornecedorReturn } from "@/hooks/useFornecedor";
import usePedido, { usePedidoReturn } from "@/hooks/usePedido";
import useProduto, { useProdutoReturn } from "@/hooks/useProduto";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../(contexts)/NotificationContext";

interface CalcularContextProps {

    fornecedorContext: useFornecedorReturn
    pedidoContext: usePedidoReturn
    produtoContext: useProdutoReturn
    displayControl: IDisplayControl 
    valid: boolean
    tabela: produtoCadastro[]

    submitForm: () => void

}

interface fatoresContext {

    base: string
    fatorNormal: string
    fatorST: string

    transporte: string
    st: string

    ipi: string
    desconto: string 

}

interface produtoCadastro {

    id: number
    codigo: string
    
    st: boolean
    unitario: string
    unitarioNota: string
    composto: string[] | null

    fatores: fatoresContext

}

interface IDisplayControl {

    transporte: boolean
    st: boolean
    desconto: boolean
    ipi: boolean
    unitarioNota: boolean
    composto: boolean

    produtoSt: boolean


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

    const fornecedorContext = useFornecedor()
    const pedidoContext = usePedido()
    const produtoContext = useProduto()

    // TABELA CONTEXT _ TODO

    const {fornecedorData} = fornecedorContext
    const {pedidoData} = pedidoContext
    const {produtoData, resetForm} = produtoContext

    const [tabela, setTabela] = useState<produtoCadastro[]>([])

    // Quando implementar tabela esse estado será o estado tabelaContext: produtoCadastro[]
    // const [produtoCadastros, setProdutoCadastros] = useState<produtoCadastro>() 

    const displayControl: IDisplayControl = {

        transporte: fornecedorData.transporte,
        st: fornecedorData.st,
        desconto: fornecedorData.desconto,
        ipi: fornecedorData.ipi, 
        unitarioNota: fornecedorData.unitarioNota,
        composto: fornecedorData.composto,

        produtoSt: produtoData.st,

    }

    const valuesToCheck = useMemo(() => {

        return {
            codigo: produtoData.codigo,
            unitario: produtoData.unitario,
            unitarioNota: produtoData.unitarioNota,
    
            base: fornecedorData.fatorBase,
            fatorNormal: fornecedorData.fatorNormal,
            fatorST: fornecedorData.fatorST,
    
            transporte: pedidoData.fatorTransporte,
            st: pedidoData.fatorST,
    
            ipi: produtoData.ipi,
            desconto: produtoData.desconto,   
        }

    }, [fornecedorData, pedidoData, produtoData])

    const valid = useMemo(() => {
        return Object.values(valuesToCheck).every( value => value !== '' )
    }, [valuesToCheck])
    

    const submitForm = () => {

        const produtoCadastro: produtoCadastro = {

            id: new Date().getTime(),
            codigo: produtoData.codigo,
            st: produtoData.st,
            unitario: produtoData.unitario,
            unitarioNota: produtoData.unitarioNota,
            composto: [produtoData.composto1, produtoData.composto2],
            fatores: {

                base: fornecedorData.fatorBase,
                fatorNormal: fornecedorData.fatorNormal,
                fatorST: fornecedorData.fatorST,
        
                transporte: pedidoData.fatorTransporte,
                st: pedidoData.fatorST,
        
                ipi: produtoData.ipi,
                desconto: produtoData.desconto,

            }
          
        }

        if(!valid) addNotification({tipo: 'erro', mensagem: 'Não foi possível adicionar o produto na tabela, preencha todos os dados!'}) 

        setTabela( prev => ([...prev, produtoCadastro]) )
        resetForm()

    }

    return <CalcularContext.Provider
        value={{
            fornecedorContext,
            pedidoContext,
            produtoContext,
            displayControl,
            valid,
            tabela,
            submitForm,
        }}
    >
        {children}
    </CalcularContext.Provider>

}