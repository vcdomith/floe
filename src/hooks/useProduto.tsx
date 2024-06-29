import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, FormEvent, MutableRefObject, SetStateAction, useRef, useState } from "react";
import Converter from "@/utils/typeConversion";

export interface useProdutoReturn {

    produtoData: IProdutoContext
    setProdutoData: Dispatch<SetStateAction<IProdutoContext>>
    handleProdutoChange: <T>(field: keyof IProdutoContext) => (valor: T) => void
    handleProdutoSubmit: (campo: 'ipi' | 'composto', e: FormEvent<HTMLFormElement>, fatorBase: string) => void
    resetForm: () => void
    codigoInputRef: MutableRefObject<HTMLInputElement>

}

export interface IProdutoContext {

    st: boolean
    codigo: string
    
    desconto: string
    ipi: string
    ipiProporcional: string

    unitarioNota: string
    unitarioPedido: string
    unitarioComposto: string
    composto1: string
    composto2: string

}

const INITIAL_STATE: IProdutoContext = {

    st: true,

    codigo: '',
    
    desconto: '',
    ipi: '',
    ipiProporcional: '',

    unitarioNota: '',
    unitarioPedido: '',
    unitarioComposto: '',
    composto1: '',
    composto2: '',

}

export default function useProduto() {

    const [produtoData, setProdutoData] = useState(INITIAL_STATE)
    const codigoInputRef = useRef<HTMLInputElement>(null)

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

    return {
        produtoData, 
        setProdutoData, 
        handleProdutoChange, 
        handleProdutoSubmit, 
        resetForm,
        codigoInputRef
    } as useProdutoReturn

}