import { Dispatch, SetStateAction, useMemo, useState } from "react";
import Converter from "@/utils/typeConversion";
import { CalcularContext, ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { IProdutoContext } from "./useProduto";
import getDifferentKeys from "@/utils/differentKeys";
import { UseSectionContext } from "./useSectionContext";

export interface UsePedido {

    pedidoData: IFatoresPedido
    setPedidoData: Dispatch<SetStateAction<IFatoresPedido>>
    handlePedidoChange: <T>(field: keyof IFatoresPedido) =>(valor: T) => void
    handlePedidoSubmit: (campo: ('transporte' | 'st'), fatorBase: string) => void
    resetPedido: () => void

    getPedidoDisplayControl: (ctx: UseSectionContext) => IPedidoDisplayControl

    pedidoDiff: (keyof IFatoresPedido)[]
    updatePedidoControl: (pedido: IFatoresPedido) => void
    rollbackPedido: () => void
    resetPedidoControl: () => void

}

export interface IFatoresPedido {

    usaNcm: boolean
    quantidadeProdutos: string

    fatorTransportePedido: string
    valorFrete: string
    fatorFrete: string
    valorTotalProdutos: string

    fatorSTPedido: string
    valorST: string
    multiploST: string
    valorTotalProdutosST: string

}

export interface IPedidoDisplayControl extends 
    Record<
        keyof Pick<
            IFatoresPedido,
            (
                'usaNcm' |
                'quantidadeProdutos' | 
                'fatorTransportePedido' | 
                'fatorSTPedido'
            )
        >, 
        boolean
    >{}

const INITIAL_STATE: IFatoresPedido = {

    usaNcm: false,
    quantidadeProdutos: '',

    fatorTransportePedido: '',
    valorFrete: '',
    fatorFrete: '3,4',
    valorTotalProdutos: '',

    fatorSTPedido: '',
    valorST: '',
    multiploST: '1',
    valorTotalProdutosST: '',

}

export default function usePedido( produto: (ProdutoCadastro | null) = null ): UsePedido {

    const initialState: IFatoresPedido = useMemo(() => {
        if (!produto) return INITIAL_STATE

        return {
            usaNcm: !!produto.ncm,
            quantidadeProdutos: '',

            fatorTransportePedido: produto.fatores.transporte,
            valorFrete: '',
            fatorFrete: '3,4',
            valorTotalProdutos: '',

            fatorSTPedido: produto.fatores.st,
            valorST: '',
            multiploST: '1',
            valorTotalProdutosST: '',
        }
    }, [produto])

    const [pedidoData, setPedidoData] = useState<IFatoresPedido>(initialState)
    
    const [pedidoControl, updatePedidoControl] = useState<IFatoresPedido>()

    const rollbackPedido = () => setPedidoData((prev) => {
        return pedidoControl
        ? pedidoControl
        : {...prev}
    })

    const resetPedidoControl = () => {
        updatePedidoControl(undefined)
    }
    
    const { stringToFloat, floatToString } = Converter

    function handlePedidoChange<T>(field: keyof IFatoresPedido){

        const savedField = field

        return (valor: T) => setPedidoData((prev) => ({
            ...prev,
            [savedField]: (savedField !== 'usaNcm') ? valor : !prev[savedField]
        }))

    }

    const handlePedidoSubmit = (campo: ('transporte' | 'st'), fatorBase: string) => {
        
        switch (campo) {
            case 'transporte':

                const resultadoTransporte = (1 + (
                    (stringToFloat(pedidoData.valorFrete) * stringToFloat(pedidoData.fatorFrete)) / 
                    (stringToFloat(pedidoData.valorTotalProdutos) * stringToFloat(fatorBase))
                ))

                setPedidoData(prev => ({...prev, ['fatorTransportePedido' as keyof IFatoresPedido]: floatToString(resultadoTransporte, 3)}))

                break;
        
            case 'st': 

                const resultadoSt = (1 + (
                    (stringToFloat(pedidoData.valorST) * stringToFloat(pedidoData.multiploST)) / 
                    (stringToFloat(pedidoData.valorTotalProdutosST) * stringToFloat(fatorBase))
                ))

                setPedidoData(prev => ({...prev, ['fatorSTPedido' as keyof IFatoresPedido]: floatToString(resultadoSt, 3)}))

                break;

        }

    }

    const resetPedido = () => {
        setPedidoData({...INITIAL_STATE})
    }

    const getPedidoDisplayControl = ({
        fornecedorContext: {fornecedorData},
         produtoContext: {produtoData}
        }: UseSectionContext): IPedidoDisplayControl => 
    (produtoData.st)
    ? {
        usaNcm: true,
        quantidadeProdutos: true,
        fatorTransportePedido: fornecedorData.usaTransporte,
        fatorSTPedido: fornecedorData.usaSt,

    }
    : {
        usaNcm: true,
        quantidadeProdutos: true,
        fatorTransportePedido: false,
        fatorSTPedido: false,
    }

    const pedidoDiff: (keyof IFatoresPedido)[] = useMemo(() => {
        if (pedidoControl) return getDifferentKeys(pedidoData, pedidoControl)
        return []
    }
    , [pedidoData, pedidoControl])

    return {
        pedidoData, 
        setPedidoData, 
        handlePedidoChange, 
        handlePedidoSubmit,
        resetPedido,

        getPedidoDisplayControl,
        
        pedidoDiff,
        updatePedidoControl,
        rollbackPedido,
        resetPedidoControl,
    }

}