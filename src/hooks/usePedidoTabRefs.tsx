import { useCallback, useMemo, useRef } from "react"

export interface InputRefs {

    fatorTransportePedidoRef: HTMLInputElement | null
    valorFreteRef: HTMLInputElement | null
    fatorFreteRef: HTMLInputElement | null
    valorTotalProdutosRef: HTMLInputElement | null

    fatorStPedidoRef: HTMLInputElement | null
    valorSTRef: HTMLInputElement | null
    multiploSTRef: HTMLInputElement | null
    valorTotalProdutosSTRef: HTMLInputElement | null
}

export interface Transporte_STRefs extends Partial<InputRefs> {
    values: () => any[]
}

const usePedidoTabRefs = () => {

    const refs = useRef<InputRefs>({

        fatorTransportePedidoRef: null,
        valorFreteRef: null, 
        fatorFreteRef: null, 
        valorTotalProdutosRef: null,

        fatorStPedidoRef: null,
        valorSTRef: null, 
        multiploSTRef: null,
        valorTotalProdutosSTRef: null,
    })

    const pedidoFormRef = useRef<HTMLFormElement>(null)

    const transporteRefs = {
        valorFreteRef: refs.current.valorFreteRef,
        fatorFreteRef: refs.current.fatorFreteRef,
        valorTotalProdutosRef: refs.current.valorTotalProdutosRef,
        values: () => {
            return (Object.values(transporteRefs) as HTMLInputElement[])
                .filter( el => typeof el !== 'function' )
                .map(el => el.value )
        },
    }
    
    const stRefs = {
        valorSTRef: refs.current.valorSTRef,
        multiploSTRef: refs.current.multiploSTRef,
        valorTotalProdutosSTRef: refs.current.valorTotalProdutosSTRef,
        values: () => {
            return (Object.values(stRefs) as HTMLInputElement[])
                .filter( el => typeof el !== 'function' )
                .map(el => el.value )
        },
    }

    const assignRef = (key: keyof InputRefs) => (el: HTMLInputElement | null ) =>  {

        refs.current[key] = el

    }

    return { refs, pedidoFormRef, transporteRefs, stRefs, assignRef }

}

export default usePedidoTabRefs