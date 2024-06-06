import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, SetStateAction, useState } from "react";

export interface useProdutoReturn {

    produtoData: IPedidoContext
    setProdutoData: Dispatch<SetStateAction<IPedidoContext>>
    handleProdutoChange: <T>(field: keyof IPedidoContext) => (valor: T) => void
    resetForm: () => void

}

interface IPedidoContext {

    st: boolean
    codigo: string
    
    desconto: string
    ipi: string

    unitarioNota: string
    unitario: string
    composto1: string
    composto2: string

}

const INITIAL_STATE: IPedidoContext = {

    st: false,

    codigo: '',
    
    desconto: '',
    ipi: '',

    unitarioNota: '',
    unitario: '',
    composto1: '',
    composto2: '',

}

export default function useProduto() {

    const [produtoData, setProdutoData] = useState(INITIAL_STATE)

    function handleProdutoChange<T>(field: keyof IPedidoContext) {

        const savedField = field

        return (valor: T) => setProdutoData((prev) => ({
                    ...prev,
                    [savedField]: (savedField !== 'st') ? valor : !prev[savedField],
                }))

    }

    function resetForm() {

        setProdutoData((prev) => ({
            ...INITIAL_STATE,
            st: prev['st']
        }))

    }

    return {produtoData, setProdutoData, handleProdutoChange, resetForm} as useProdutoReturn

}