import { Dispatch, SetStateAction, useState } from "react";
import Converter from "@/utils/typeConversion";
import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";

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

export interface usePedidoReturn {

    pedidoData: IFatoresPedido
    setPedidoData: Dispatch<SetStateAction<IFatoresPedido>>
    handlePedidoChange: <T>(field: keyof IFatoresPedido) =>(valor: T) => void
    handlePedidoSubmit: (campo: ('transporte' | 'st'), fatorBase: string) => void
    resetPedido: () => void

}

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

export default function usePedido( produto: (ProdutoCadastro | null) = null ) {

    const [pedidoData, setPedidoData] = useState<IFatoresPedido>(() => {
        
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
    })

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

    return {
        pedidoData, 
        setPedidoData, 
        handlePedidoChange, 
        handlePedidoSubmit,
        resetPedido
    } as usePedidoReturn

}