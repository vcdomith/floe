import { CalcularContextProps, FatoresContext, IDisplayControl, ProdutoCadastro, useCalcular } from "@/app/(app)/calcular/context/CalcularContext";
import useFornecedor, { useFornecedorReturn } from "./useFornecedor";
import usePedido, { usePedidoReturn } from "./usePedido";
import useProduto, { IProdutoContext, useProdutoReturn } from "./useProduto";
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from "react";
import _, { initial, isArray } from 'lodash'
import { useNotification } from "@/app/(app)/(contexts)/NotificationContext";
import { useModal } from "@/app/(app)/(contexts)/ModalContext";

// interface UseEditProdutoReturn {
    
//     produtoEdit: ProdutoCadastro
//     setProdutoEdit: Dispatch<SetStateAction<ProdutoCadastro>>
//     handleProdutoChange: <T>(field: keyof Omit<ProdutoCadastro, "fatores" | "composto">) => (valor: T) => void
//     handleCompostoChange: (index: 0 | 1) => (valor: string) => void
//     handleFatorChange: (field: keyof FatoresContext) => (valor: ChangeEvent<HTMLInputElement>) => void,
//     resetProduto: () => void
//     displayControl: IDisplayControl
//     valid: boolean

// }

interface UseEditProdutoReturn {
    
    produtoEdit: ProdutoCadastro
    controlledInputs: IProdutoContext
    handleProdutoChange: <T>(field: keyof IProdutoContext) => (valor: T) => void
    resetForm: () => void
    displayControl: IDisplayControl
    valid: boolean
    updateTabela: (id: number, updatedProduto: ProdutoCadastro) => void

}

export default function useEditProduto( produto: ProdutoCadastro ) {

    // const [produtoEdit, setProdutoEdit] = useState<ProdutoCadastro>(produto)
    // const {fatores, composto, ...atributos} = useMemo(() => {
    //     return produtoEdit
    // }, [produtoEdit])

    const { produtoData, handleProdutoChange, resetForm } = useProduto(produto)
    const {

        st,

        codigo,
        ncm,
        
        desconto,
        ipi,
        ipiProporcional,

        unitarioNota,
        unitarioPedido,
        unitarioComposto,
        composto1,
        composto2,

    } = produtoData

    const { 
        getDisplayControl, 
        fornecedorContext: {fornecedorData}, 
        pedidoContext: {pedidoData},
        updateProdutoTabela,
    } = useCalcular()

    const { clearModal } = useModal()

    const unitario = useMemo(() => {

        if (fornecedorData.usaComposto) 
            return unitarioComposto
        else if (fornecedorData.usaUnitarioPedido) 
            return unitarioPedido
        else 
            return unitarioNota

    }, [fornecedorData, produtoData])

    const produtoEdit: ProdutoCadastro = useMemo(() => ({

        id: produto.id,
        codigo: codigo,
        ncm: ncm,
        st: st,
        unitario: unitario,
        unitarioNota: unitarioNota,
        composto: [composto1, composto2],
        fatores: {
            base: fornecedorData.fatorBase,
            fatorBaseNormal: (st) 
                ? '1'
                : fornecedorData.fatorBaseNormal
            ,
            fatorBaseST: (st) 
                ? fornecedorData.fatorBaseST
                : '1'
            ,

            transporte: (st) ? pedidoData.fatorTransportePedido || '1' : '1',
            st: (st) ? pedidoData.fatorSTPedido || '1' : '1',

            ipi: (st) ? ipi : '1',
            desconto: (st) ? desconto : '1',
        }

    }), [produtoData])

    const {fatores, composto, ...atributos} = useMemo(() => {
        return produtoEdit
    }, [produtoEdit])

    const displayControl = useMemo(() => getDisplayControl(produtoData.st), [produtoData, getDisplayControl])

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
 
    const updateTabela = () => {
        updateProdutoTabela(produto.id, produtoEdit)
        clearModal()
    }

    return {
        produtoEdit,
        controlledInputs: produtoData,
        handleProdutoChange,
        resetForm,
        displayControl,
        valid,
        updateTabela,
    } as UseEditProdutoReturn

}