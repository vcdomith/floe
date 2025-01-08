import useDynamicState from "@/hooks/useDynamicState";
import useFilter, { UseFilter } from "@/hooks/useFilter";
import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";

interface PedidosContext extends UseFilter {

}

export const PedidosContext = createContext<PedidosContext | undefined>(undefined)
PedidosContext.displayName = 'Pedidos'

export const usePedidos = () => {
    const context = useContext(PedidosContext)
    if (!context) throw new Error("usePedidos must be used within it's Provider")
    return context
}

export const PedidosProvider = ({ children }: { children: React.ReactNode }) => {

    const path = usePathname()

    const { searchParam: initialSearch , setSearchParam: initialSet, searchField, setSearchFieldCapitalized } = useFilter()
    const [searchParam, setSearchParam] = useDynamicState({
        initialState: initialSearch,
        dependency: path
    })

    return <PedidosContext.Provider
        value={{
            searchParam,
            setSearchParam,
            searchField,
            setSearchFieldCapitalized,
        }}
    >
        {children}
    </PedidosContext.Provider>

}