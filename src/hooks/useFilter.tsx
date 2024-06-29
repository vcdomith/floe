import { produtoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import { Dispatch, SetStateAction, useState } from "react";

export interface useFilterReturn {

    searchParam: string
    setSearchParam: Dispatch<SetStateAction<string>>
    searchField: keyof produtoCadastro
    setSearchField: Dispatch<SetStateAction<SearchFieldKeys>>

}

export type SearchFieldKeys = Extract<keyof produtoCadastro, 'unitario' | 'codigo'>

export default function useFilter() {

    const [searchParam, setSearchParam] = useState('')
    const [searchField, setSearchField] = useState< SearchFieldKeys >('unitario')


    return {
        searchParam,
        setSearchParam,
        searchField,
        setSearchField
    } as useFilterReturn

}