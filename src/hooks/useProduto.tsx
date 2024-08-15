import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, FormEvent, MutableRefObject, RefObject, SetStateAction, useMemo, useRef, useState } from "react";
import Converter from "@/utils/typeConversion";
import { CalcularContext, ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import getDifferentKeys from "@/utils/differentKeys";

export interface UseProduto {

    produtoData: IProdutoContext
    setProdutoData: Dispatch<SetStateAction<IProdutoContext>>
    handleProdutoChange: <T>(field: keyof IProdutoContext) => (valor: T) => void
    handleProdutoSubmit: (campo: 'ipi' | 'composto', e: FormEvent<HTMLFormElement>, fatorBase: string) => void
    resetForm: (preserveSt?: boolean) => void
    codigoInputRef: RefObject<HTMLInputElement> | null

    getProdutoDisplayControl: (ctx: CalcularContext) => IProdutoDisplayControl

    produtoDiff: (keyof IProdutoContext)[]
    updateProdutoControl: (produto: IProdutoContext) => void

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

export interface IProdutoDisplayControl extends Record<keyof Omit<IProdutoContext, 'codigo' | 'st' | 'ipiProporcional' | 'unitarioNota' | 'composto1' | 'composto2'>, boolean> {}

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

export default function useProduto(produto: (ProdutoCadastro | null) = null): UseProduto {

    const {floatToString, stringToFloat} = Converter

    const initialState = useMemo(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [produto])

    const [produtoData, setProdutoData] = useState<IProdutoContext>(initialState)

    const [produtoControl, updateProdutoControl] = useState<IProdutoContext>()

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

        setProdutoData( prev => {
            return {
                ...initialState,
                st: (preserveSt) ? prev.st : initialState.st 
            }
        })

    }

    const getProdutoDisplayControl = ({
        fornecedorContext: {fornecedorData},
        pedidoContext: {pedidoData},
        produtoContext: {produtoData},
    }: CalcularContext): IProdutoDisplayControl => 
    (produtoData.st)
    ? {

        ncm: pedidoData.usaNcm,
        desconto: fornecedorData.usaDesconto,
        ipi: fornecedorData.usaIpi,

        unitarioPedido: (fornecedorData.usaUnitarioPedido && !fornecedorData.usaComposto), 
        unitarioComposto: (fornecedorData.usaUnitarioPedido && fornecedorData.usaComposto),

    }
    : {

        ncm: pedidoData.usaNcm,
        desconto: fornecedorData.usaDesconto,
        ipi: false,

        unitarioPedido: (fornecedorData.usaUnitarioPedido && !fornecedorData.usaComposto), 
        unitarioComposto: (fornecedorData.usaUnitarioPedido && fornecedorData.usaComposto),

    }
    
    const produtoDiff: (keyof IProdutoContext)[] = useMemo(() => {
        if (produtoControl) return getDifferentKeys(produtoData, produtoControl)
        return []
    }
    , [produtoData, produtoControl])

    return {
        produtoData, 
        setProdutoData, 
        handleProdutoChange, 
        handleProdutoSubmit, 
        resetForm,
        codigoInputRef,

        getProdutoDisplayControl,

        produtoDiff,
        updateProdutoControl
    }

}