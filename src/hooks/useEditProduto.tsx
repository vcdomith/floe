import { ProdutoCadastro, useCalcular } from "@/app/(app)/calcular/context/CalcularContext";

import useProduto, { IProdutoContext } from "./useProduto";
import { useMemo } from "react";
import { useModal } from "@/app/(app)/(contexts)/ModalContext";
import isEqual from "@/utils/isEqual";
import { IDisplayControl } from "./useContextControl";

interface UseEditProduto {
    
    produtoEdit: ProdutoCadastro
    controlledInputs: IProdutoContext
    handleProdutoChange: <T>(field: keyof IProdutoContext) => (valor: T) => void
    resetForm: (preserveSt?: boolean) => void
    displayControl: IDisplayControl
    valid: boolean
    updateTabela: (id: number, updatedProduto: ProdutoCadastro) => void
    removeProduto: (id: number) => void

}

export default function useEditProduto( produto: ProdutoCadastro ): UseEditProduto  {

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

    const { context : { context }} = useCalcular()

    const { 
        contextControl: { getDisplayControl }, 
        fornecedorContext: { fornecedorData }, 
        pedidoContext: { pedidoData },
        tabelaContext: { updateProdutoTabela, removeProduto }
    } = context

    const { clearModal } = useModal()

    const unitario = useMemo(() => {

        if (fornecedorData.usaComposto) 
            return unitarioComposto
        else if (fornecedorData.usaUnitarioPedido) 
            return unitarioPedido
        else 
            return unitarioNota

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            desconto: desconto || '1',
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [produtoData])

    const {fatores, composto, ...atributos} = useMemo(() => {
        return produtoEdit
    }, [produtoEdit])

    const displayControl = useMemo(() => getDisplayControl(produtoData.st), [produtoData, getDisplayControl])

    const valid: boolean = useMemo(() => {

        // if (_.isEqual(produto, produtoEdit)) return false
        if (isEqual(produto, produtoEdit)) return false

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
        removeProduto
    }

}