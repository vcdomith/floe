import { useCallback, useMemo, useRef } from "react"


const usePedidoTabRefs = () => {

    interface Refs {
        valorFreteRef: HTMLInputElement | null
        fatorFreteRef: HTMLInputElement | null
        valorTotalProdutosRef: HTMLInputElement | null
        valorSTRef: HTMLInputElement | null
        multiploSTRef: HTMLInputElement | null
        valorTotalProdutosSTRef: HTMLInputElement | null
    }

    interface Transporte_STRefs extends Partial<Refs> {
        values: () => any[]
    }

    const refs = useRef<Refs>({
        valorFreteRef: null, 
        fatorFreteRef: null, 
        valorTotalProdutosRef: null,
        valorSTRef: null, 
        multiploSTRef: null,
        valorTotalProdutosSTRef: null,
    })

    const transporteRefs = useMemo(() => {

        const transporteRefs: Transporte_STRefs = {
        valorFreteRef: refs.current.valorFreteRef,
        fatorFreteRef: refs.current.fatorFreteRef,
        valorTotalProdutosRef: refs.current.valorTotalProdutosRef,
        values: () => [],
        }

        transporteRefs.values = () => {
            return (
                (Object.values(transporteRefs) as HTMLInputElement[])
                .filter( el => typeof el !== 'function' )
                .map(el => el.value )
            )
        }

        return transporteRefs
        
    }, [refs.current.valorFreteRef, refs.current.fatorFreteRef, refs.current.valorTotalProdutosRef])


    const stRefs = useMemo(() => {

        const stRefs: Transporte_STRefs = {
        valorSTRef: refs.current.valorSTRef,
        multiploSTRef: refs.current.multiploSTRef,
        valorTotalProdutosSTRef: refs.current.valorTotalProdutosSTRef,
        values: () => []
        }

        stRefs.values = () => {

            return (
                (Object.values(stRefs) as HTMLInputElement[])
                .filter( el => typeof el !== 'function' )
                .map( el => el.value )
            )

        }

        return stRefs

    }, [refs.current.valorFreteRef, refs.current.fatorFreteRef, refs.current.valorTotalProdutosRef])

    const assignRef = useCallback((key: keyof Refs ) => (el: HTMLInputElement | null ) =>  {

        refs.current[key] = el

    }, [])

    return { refs, transporteRefs, stRefs, assignRef }

}

export default usePedidoTabRefs