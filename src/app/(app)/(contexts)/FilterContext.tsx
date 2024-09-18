import useFilter, { UseFilter } from "@/hooks/useFilter"
import { createContext, useContext } from "react"

export const FilterContext = createContext<UseFilter | undefined>(undefined)
FilterContext.displayName = 'Filter'

export const useFilterContext = () => {
    const context = useContext(FilterContext)
    if (!context) throw new Error("useFilterContext must be used within it's Provider")
    return context
}

export const FilterProvider = ({ children }: { children: React.ReactNode}) => {

    const { searchParam, setSearchParam, searchField, setSearchFieldCapitalized } = useFilter()

    return <FilterContext.Provider
        value={{
            searchParam,
            setSearchParam,
            searchField,
            setSearchFieldCapitalized
        }}
    >
        {children}
    </FilterContext.Provider>

}