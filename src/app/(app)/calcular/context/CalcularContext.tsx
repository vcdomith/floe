'use client'
import useFornecedor, { useFornecedorReturn } from "@/hooks/useFornecedor";
import usePedido, { usePedidoReturn } from "@/hooks/usePedido";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";

interface CalcularContextProps {

    fornecedorContext: useFornecedorReturn
    pedidoContext: usePedidoReturn

}

export const CalcularContext = createContext<CalcularContextProps | undefined>(undefined)
CalcularContext.displayName = 'Calcular'

export const useCalcular = () => {
    const context = useContext(CalcularContext)
    if (!context) throw new Error('useCalcular must be used within a CalcularProvider')
    return context
}

export const CalcularProvider = ({ children }: { children: React.ReactNode}) => {

    const fornecedorContext = useFornecedor()
    const pedidoContext = usePedido()

    const {fornecedorData} = fornecedorContext

    const [produto, setProduto] = useState()

    useEffect(() => {
        console.log(fornecedorData, (fornecedorData.nome !== '' ));
    }, [fornecedorData])

    return <CalcularContext.Provider
        value={{
            fornecedorContext,
            pedidoContext
        }}
    >
        {children}
    </CalcularContext.Provider>

}