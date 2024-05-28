import { IFornecedor } from "@/interfaces/IFornecedor";
import { ChangeEvent, SetStateAction, useState } from "react";

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

    const [fornecedorData, setForncedorData] = useState<IFornecedor>(INITIAL_STATE)

    function handleFornecedorChange<T>(field: keyof IFornecedor) {

        const savedField = field

        // Logic to handle different types of input: strings and booleans
        return (valor: T) => setForncedorData((prev) => ({
            ...prev, 
            [field]: (STRING_INPUT_FIELDS.includes(savedField)) ? valor : !prev[field],
        }))

    }

    function resetForm() {

        setForncedorData({...INITIAL_STATE})

    }

    return [fornecedorData, setForncedorData, handleFornecedorChange, resetForm] as const

}