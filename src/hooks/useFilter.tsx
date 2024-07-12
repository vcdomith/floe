import { produtoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import capitalize from "@/utils/capitalize";
import { Dispatch, SetStateAction, useState } from "react";

export interface useFilterReturn {

    searchParam: string
    setSearchParam: Dispatch<SetStateAction<string>>
    searchField: keyof produtoCadastro
    setSearchFieldCapitalized: Dispatch<SetStateAction<SearchFieldKeys>>

}

export type SearchFieldKeys = Extract<keyof produtoCadastro, 'unitario' | 'codigo'>

export default function useFilter() {

    const [searchParam, setSearchParam] = useState('')
    const [searchField, setSearchField] = useState< SearchFieldKeys >(capitalize('unitario'))
    const setSearchFieldCapitalized = (value: SearchFieldKeys) => {
        setSearchField(capitalize(value))
    }

    return {
        searchParam,
        setSearchParam,
        searchField,
        setSearchFieldCapitalized
    } as useFilterReturn

}