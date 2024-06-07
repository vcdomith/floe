import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Converter from "@/utils/typeConversion";

export interface useProdutoReturn {

    produtoData: IProdutoContext
    setProdutoData: Dispatch<SetStateAction<IProdutoContext>>
    handleProdutoChange: <T>(field: keyof IProdutoContext) => (valor: T) => void
    handleProdutoSubmit: (campo: 'ipi' | 'composto', e: FormEvent<HTMLFormElement>, fatorBase: string) => void
    resetForm: () => void

}

interface IProdutoContext {

    st: boolean
    codigo: string
    
    desconto: string
    ipi: string
    ipiProporcional: string

    unitarioNota: string
    unitario: string
    composto1: string
    composto2: string

}

const INITIAL_STATE: IProdutoContext = {

    st: false,

    codigo: '',
    
    desconto: '',
    ipi: '',
    ipiProporcional: '',

    unitarioNota: '',
    unitario: '',
    composto1: '',
    composto2: '',

}

export default function useProduto() {

    const [produtoData, setProdutoData] = useState(INITIAL_STATE)
    const {floatToString, stringToFloat} = Converter

    function handleProdutoChange<T>(field: keyof IProdutoContext) {

        const savedField = field

        return (valor: T) => setProdutoData((prev) => ({
                    ...prev,
                    [savedField]: (savedField !== 'st') ? valor : !prev[savedField],
                }))

    }

    const handleProdutoSubmit = (campo: 'ipi' | 'composto', e: FormEvent<HTMLFormElement>, fatorBase: string ) => {

        e.preventDefault()

        switch (campo) {

            case 'ipi':
                
                const resultadoIpiProporcional = 
                    (parseInt((stringToFloat(produtoData.ipiProporcional) - 1).toFixed(4)) / stringToFloat(fatorBase))

                setProdutoData((prev) => ({...prev, [campo as keyof IProdutoContext]: resultadoIpiProporcional}))

                break;
        
            case 'composto':

                break;

         
        }

    }

    function resetForm() {

        setProdutoData((prev) => ({
            ...INITIAL_STATE,
            st: prev['st']
        }))

    }

    return {produtoData, setProdutoData, handleProdutoChange, handleProdutoSubmit, resetForm} as useProdutoReturn

}