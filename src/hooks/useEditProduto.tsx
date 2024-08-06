import { CalcularContextProps, FatoresContext, IDisplayControl, ProdutoCadastro, useCalcular } from "@/app/(app)/calcular/context/CalcularContext";
import useFornecedor, { useFornecedorReturn } from "./useFornecedor";
import usePedido, { usePedidoReturn } from "./usePedido";
import useProduto, { useProdutoReturn } from "./useProduto";
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from "react";
import _, { initial, isArray } from 'lodash'
import { useNotification } from "@/app/(app)/(contexts)/NotificationContext";

interface UseEditProdutoReturn {
    
    produtoEdit: ProdutoCadastro
    setProdutoEdit: Dispatch<SetStateAction<ProdutoCadastro>>
    handleProdutoChange: <T>(field: keyof Omit<ProdutoCadastro, "fatores" | "composto">) => (valor: T) => void
    handleCompostoChange: (index: 0 | 1) => (valor: string) => void
    handleFatorChange: (field: keyof FatoresContext) => (valor: ChangeEvent<HTMLInputElement>) => void,
    resetProduto: () => void
    displayControl: IDisplayControl
    valid: boolean

}

export default function useEditProduto( produto: ProdutoCadastro ) {

    const [produtoEdit, setProdutoEdit] = useState<ProdutoCadastro>(produto)
    const {fatores, composto, ...atributos} = useMemo(() => {
        return produtoEdit
    }, [produtoEdit])

    const { getDisplayControl, fornecedorContext } = useCalcular()
    // const {getDisplayControl, fornecedorContext: {fornecedorData}} = calcularContext

    const displayControl = useMemo(() => getDisplayControl(produtoEdit.st), [produtoEdit, getDisplayControl])
    console.log(produtoEdit);
   
    // console.log('fatoresValid:', fatoresValid, 'atributosValid:', atributosValid);

    const valid: boolean = useMemo(() => {

        if (_.isEqual(produto, produtoEdit)) return false

        if (Object.entries(atributos).some( ([key, value]) => {
            if (displayControl.ncm && key === 'ncm') 
                return value === '' || (value as string).length !== 8
            
            return (value === '' && key !== 'ncm')
        })) return false

        if (Object.values(fatores).some(value => value === '')) return false

        return true
        
    }, [produtoEdit, produto, displayControl, atributos, fatores])
    console.log(valid);

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
        displayControl,
        valid
    } as UseEditProdutoReturn

}