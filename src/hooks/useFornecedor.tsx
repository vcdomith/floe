import { IFornecedor } from "@/interfaces/IFornecedor";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

export interface useFornecedorReturn {

    fornecedorData: IFornecedor
    setFornecedorData: Dispatch<SetStateAction<IFornecedor>>
    handleFornecedorChange: <T>(field: keyof IFornecedor) => (valor: T) => void
    resetForm: () => void

}

const STRING_INPUT_FIELDS: (keyof IFornecedor)[] = ['nome', 'fatorBase', 'fatorNormal', 'fatorST']
const INITIAL_STATE: IFornecedor = {
    nome: '',
    fatorBase: '',
    fatorNormal: '',
    fatorST: '',
    transporte: true,
    st: true,
    desconto: false,
    ipi: false,
    unitarioNota: false,
    composto: false,
}

export default function useFornecedor() {

    const [fornecedorData, setFornecedorData] = useState<IFornecedor>(INITIAL_STATE)

    function handleFornecedorChange<T>(field: keyof IFornecedor) {

        const savedField = field

        // Logic to handle different types of input: strings and booleans
        return (valor: T) => setFornecedorData((prev) => ({
            ...prev, 
            [field]: (STRING_INPUT_FIELDS.includes(savedField)) ? valor : !prev[field],
        }))

    }

    function resetForm() {

        setFornecedorData({...INITIAL_STATE})

    }

    return {fornecedorData, setFornecedorData, handleFornecedorChange, resetForm} as useFornecedorReturn

}