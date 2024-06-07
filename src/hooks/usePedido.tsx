import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Converter from "@/utils/typeConversion";

interface IFatoresPedido {

    fatorTransporte: string
    valorFrete: string
    fatorFrete: string
    valorTotalProdutos: string

    fatorST: string
    valorST: string
    multiploST: string
    valorTotalProdutosST: string

}

export interface usePedidoReturn {

    pedidoData: IFatoresPedido
    setPedidoData: Dispatch<SetStateAction<IFatoresPedido>>
    handlePedidoChange: <T>(field: keyof IFatoresPedido) =>(valor: T) => void
    handlePedidoSubmit: (campo: ('transporte' | 'st'), e: FormEvent<HTMLFormElement>, fatorBase: string) => void

}

const INITIAL_STATE: IFatoresPedido = {

    fatorTransporte: '',
    valorFrete: '',
    fatorFrete: '3,4',
    valorTotalProdutos: '',

    fatorST: '',
    valorST: '',
    multiploST: '1',
    valorTotalProdutosST: '',

}

export default function usePedido() {

    const [pedidoData, setPedidoData] = useState<IFatoresPedido>(INITIAL_STATE)

    const { stringToFloat, floatToString } = Converter

    function handlePedidoChange<T>(field: keyof IFatoresPedido){

        return (valor: T) => setPedidoData((prev) => ({
            ...prev,
            [field]: valor
        }))

    }

    const handlePedidoSubmit = (campo: ('transporte' | 'st'), e: FormEvent<HTMLFormElement>, fatorBase: string) => {

        e.preventDefault()
        
        switch (campo) {
            case 'transporte':

                const resultadoTransporte = (1 + (
                    (stringToFloat(pedidoData.valorFrete) * stringToFloat(pedidoData.fatorFrete)) / 
                    (stringToFloat(pedidoData.valorTotalProdutos) * stringToFloat(fatorBase))
                ))

                setPedidoData(prev => ({...prev, ['fatorTransporte' as keyof IFatoresPedido]: floatToString(resultadoTransporte, 3)}))

                break;
        
            case 'st': 

                const resultadoSt = (1 + (
                    (stringToFloat(pedidoData.valorST) * stringToFloat(pedidoData.multiploST)) / 
                    (stringToFloat(pedidoData.valorTotalProdutosST) * stringToFloat(fatorBase))
                ))

                setPedidoData(prev => ({...prev, ['fatorST' as keyof IFatoresPedido]: floatToString(resultadoSt, 3)}))

                break;

        }

    }

    return {pedidoData, setPedidoData, handlePedidoChange, handlePedidoSubmit} as usePedidoReturn

}