import { FatoresContext, ProdutoCadastro, useCalcular } from "@/app/(app)/calcular/context/CalcularContext";
import useFornecedor from "./useFornecedor";
import usePedido from "./usePedido";
import useProduto, { useProdutoReturn } from "./useProduto";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

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

    const { fornecedorContext } = useCalcular()

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