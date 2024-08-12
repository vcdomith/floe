import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, FormEvent, MutableRefObject, SetStateAction, useRef, useState } from "react";
import Converter from "@/utils/typeConversion";
import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";

export interface useProdutoReturn {

    produtoData: IProdutoContext
    setProdutoData: Dispatch<SetStateAction<IProdutoContext>>
    handleProdutoChange: <T>(field: keyof IProdutoContext) => (valor: T) => void
    handleProdutoSubmit: (campo: 'ipi' | 'composto', e: FormEvent<HTMLFormElement>, fatorBase: string) => void
    resetForm: (preserveSt?: boolean) => void
    codigoInputRef: MutableRefObject<HTMLInputElement>

}

export interface IProdutoContext {

    st: boolean

    codigo: string
    ncm: string
    
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
    ncm: '',
    
    desconto: '',
    ipi: '',
    ipiProporcional: '',

    unitarioNota: '',
    unitarioPedido: '',
    unitarioComposto: '',
    composto1: '',
    composto2: '',

}

export default function useProduto(produto: (ProdutoCadastro | null) = null) {

    const {floatToString, stringToFloat} = Converter

    const getInitialState = (produto: (ProdutoCadastro | null)): IProdutoContext => {
        if (!produto) return INITIAL_STATE

        return {
            st: produto.st,

            codigo: produto.codigo,
            ncm: produto.ncm,
            
            desconto: produto.fatores.desconto,
            ipi: produto.fatores.ipi,
            ipiProporcional: '',

            unitarioNota: produto.unitarioNota,
            unitarioPedido: produto.unitario,
            unitarioComposto: 
                (produto.composto.every(valor => valor !== '')) 
                    ? floatToString(stringToFloat(produto.composto[0]) + stringToFloat(produto.composto[1]), 2)
                    : '',
            composto1: produto.composto[0],
            composto2: produto.composto[1],
        } 
    } 

    const [produtoData, setProdutoData] = useState<IProdutoContext>(getInitialState(produto))
    const codigoInputRef = useRef<HTMLInputElement>(null)

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

    function resetForm(preserveSt = true) {

        // setProdutoData((prev) => ({
        //     ...INITIAL_STATE,
        //     st: prev['st']
        // }))
        setProdutoData( prev => {

            const initial = getInitialState(produto)
            return {
                ...initial,
                st: (preserveSt) ? prev.st : initial.st 
            }
        })

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