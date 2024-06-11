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
    // produtoCadastros?: produtoCadastro
    submitForm: () => void
    produtoCadastro: produtoCadastro
    valid: boolean
    tabela: produtoCadastro[]

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

    const {fornecedorData} = fornecedorContext
    const {pedidoData} = pedidoContext
    const {produtoData, resetForm} = produtoContext

    const [tabela, setTabela] = useState<produtoCadastro[]>([])

    // Quando implementar tabela esse estado será o estado tabelaContext: produtoCadastro[]
    // const [produtoCadastros, setProdutoCadastros] = useState<produtoCadastro>() 

    // const novoProdutoFatores: fatoresContext = {

    //     base: fornecedorData.fatorBase,
    //     fatorNormal: fornecedorData.fatorNormal,
    //     fatorST: fornecedorData.fatorST,

    //     transporte: pedidoData.fatorTransporte,
    //     st: pedidoData.fatorST,

    //     ipi: produtoData.ipi,
    //     desconto: produtoData.desconto,

    // }

    const produtoCadastro: produtoCadastro = useMemo(() => {
        return {
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
    }, [produtoData, fornecedorData])

    // const produtoCadastro: produtoCadastro = {
    //     id: new Date().getTime(),
    //     codigo: produtoData.codigo,
    //     unitario: produtoData.unitario,
    //     unitarioNota: produtoData.unitarioNota,
    //     composto: [produtoData.composto1, produtoData.composto2],
    //     fatores: novoProdutoFatores
    // }

    const valid: boolean = useMemo(() => {
        return Object.values(produtoCadastro).every( (element) => element !== '' )
    }, [produtoCadastro])

    console.log(produtoCadastro, valid);

    const submitForm = () => {

        if(!valid) addNotification({tipo: 'erro', mensagem: 'Não foi possível adicionar o produto na tabela, preencha todos os dados!'}) 

        setTabela( prev => ([...prev, produtoCadastro]))

    }

    // const submitForm = () => {

    //     const novoProdutoFatores: fatoresContext = {

    //         base: fornecedorData.fatorBase,
    //         fatorNormal: fornecedorData.fatorNormal,
    //         fatorST: fornecedorData.fatorST,

    //         transporte: pedidoData.fatorTransporte,
    //         st: pedidoData.fatorST,

    //         ipi: produtoData.ipi,
    //         desconto: produtoData.desconto,

    //     }

    //     const novoProdutoCadastro: produtoCadastro = {
    //         id: new Date().getTime(),
    //         codigo: produtoData.codigo,
    //         unitario: produtoData.unitario,
    //         unitarioNota: produtoData.unitarioNota,
    //         composto: [produtoData.composto1, produtoData.composto2],
    //         fatores: novoProdutoFatores
    //     }

    //     console.log(Object.values(novoProdutoCadastro));

    //     setProdutoCadastros(novoProdutoCadastro)
    //     resetForm()

    // }

    // useEffect(() => {
    //     console.log(fornecedorData, (fornecedorData.nome !== '' ));
    // }, [fornecedorData])

    return <CalcularContext.Provider
        value={{
            fornecedorContext,
            pedidoContext,
            produtoContext,
            produtoCadastro,
            valid,
            tabela,
            submitForm
            // produtoCadastros,
        }}
    >
        {children}
    </CalcularContext.Provider>

}