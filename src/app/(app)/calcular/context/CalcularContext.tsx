'use client'
import useFornecedor, { useFornecedorReturn } from "@/hooks/useFornecedor";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

interface CalcularContextProps {

    fornecedorContext: useFornecedorReturn

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

    return <CalcularContext.Provider
        value={{
            fornecedorContext
        }}
    >
        {children}
    </CalcularContext.Provider>

}