import { CalcularContextProps, FatoresContext, IDisplayControl, ProdutoCadastro, useCalcular } from "@/app/(app)/calcular/context/CalcularContext";
import useFornecedor, { useFornecedorReturn } from "./useFornecedor";
import usePedido, { usePedidoReturn } from "./usePedido";
import useProduto, { useProdutoReturn } from "./useProduto";
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from "react";
import _, { isArray } from 'lodash'
import { useNotification } from "@/app/(app)/(contexts)/NotificationContext";

interface UseEditProdutoReturn {
    
    produtoEdit: ProdutoCadastro
    setProdutoEdit: Dispatch<SetStateAction<ProdutoCadastro>>
    handleProdutoChange: <T>(field: keyof Omit<ProdutoCadastro, "fatores" | "composto">) => (valor: T) => void
    handleCompostoChange: (index: 0 | 1) => (valor: string) => void
    handleFatorChange: (field: keyof FatoresContext) => (valor: ChangeEvent<HTMLInputElement>) => void,
    resetProduto: () => void

}

export default function useEditProduto( produto: ProdutoCadastro ) {

    const [produtoEdit, setProdutoEdit] = useState<ProdutoCadastro>(produto)

    const { pedidoData } = usePedido()
    const { produtoData } = useProduto()

    const { getDisplayControl, fornecedorContext } = useCalcular()
    // const {getDisplayControl, fornecedorContext: {fornecedorData}} = calcularContext

    const displayControl = useMemo(() => getDisplayControl(produto.st), [produto, getDisplayControl])

    const valid = useMemo(() => {

        const isDiff = !(_.isEqual(produto, produtoEdit))
        const valuesAreValid = Object.values(produtoEdit).every( value => {

            if(typeof value === 'string') {
                return value !== ''
            } 
            else if(typeof value === 'object' && !(Array.isArray(value))){
                Object.values(value as FatoresContext).every( value => value !== '' )
            }
            else {
                return true
            } 

        } )
        // console.log(Object.values(produtoEdit).flatMap(Object.values));

        return (isDiff && valuesAreValid)
        
    }, [produtoEdit, produto])

    function handleProdutoChange<T>(field: keyof Omit<ProdutoCadastro, 'fatores' | 'composto'>){

        const savedField = field

        return (valor: T) => setProdutoEdit((prev) => ({
                    ...prev,
                    [savedField]: (savedField !== 'st') ? valor : !prev[savedField],
                }))

    }

    function handleCompostoChange(index: 0 | 1) {

        return (valor: string) => setProdutoEdit((prev) => {
            const newProdutoEdit = {...prev}
            newProdutoEdit.composto![index] = valor
            return newProdutoEdit
        })
    }

    function handleFatorChange(field: keyof FatoresContext){

        return (e: ChangeEvent<HTMLInputElement>) => setProdutoEdit((prev) => {

            return {
                ...prev,
                fatores: {
                    ...prev.fatores,
                    [field]: e.target.value
                }
            }
            
        })

    }

    function resetProduto() {
        setProdutoEdit(() => {
            return {
                ...produto, 
                fatores: {
                    ...produto.fatores
                }
            }
        })
    }

    // const pedidoEdit = usePedido(produto)
    // const {pedidoData, handlePedidoChange} = pedidoEdit
    
    // const produtoEdit = useProduto()
    // const {produtoData, handleProdutoChange} = produtoEdit


    return {
        produtoEdit,
        setProdutoEdit,
        handleProdutoChange,
        handleCompostoChange,
        handleFatorChange,
        resetProduto,
    } as UseEditProdutoReturn

}