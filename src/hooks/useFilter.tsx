import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import capitalizeInner from "@/utils/capitalize";
import { Dispatch, SetStateAction, useState } from "react";

export interface UseFilter {

    searchParam: string
    setSearchParam: Dispatch<SetStateAction<string>>
    searchField: keyof ProdutoCadastro
    setSearchFieldCapitalized: (value: SearchFieldKeys) => void

}

export type SearchFieldKeys = Extract<keyof ProdutoCadastro, 'unitario' | 'codigo'>

export default function useFilter(): UseFilter {

    const [searchParam, setSearchParam] = useState('')
    const [searchField, setSearchField] = useState< SearchFieldKeys >(capitalizeInner('codigo'))
    const setSearchFieldCapitalized = (value: SearchFieldKeys) => {
        setSearchField(capitalizeInner(value))
    }

    return {
        searchParam,
        setSearchParam,
        searchField,
        setSearchFieldCapitalized
    }

}