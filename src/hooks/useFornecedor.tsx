import { IFornecedor } from "@/interfaces/IFornecedor";
import { Dispatch, SetStateAction, useState } from "react";

export interface useFornecedorReturn {

    fornecedorData: IFornecedor
    setFornecedorData: Dispatch<SetStateAction<IFornecedor>>
    handleFornecedorChange: <T>(field: keyof IFornecedor) => (valor: T) => void
    resetForm: () => void

}

const STRING_INPUT_FIELDS: (keyof IFornecedor)[] = ['nome', 'fatorBase', 'fatorBaseNormal', 'fatorBaseST']
const INITIAL_STATE: IFornecedor = {
    nome: '',
    fatorBase: '',
    fatorBaseNormal: '',
    fatorBaseST: '',
    usaTransporte: true,
    usaSt: true,
    usaDesconto: false,
    usaIpi: false,
    usaUnitarioPedido: false,
    usaComposto: false,
}

export default function useFornecedor() {

    const [fornecedorData, setFornecedorData] = useState<IFornecedor>(INITIAL_STATE)

    const [fornecedorControl, updateFornecedorControl] = useState(INITIAL_STATE)

    function handleFornecedorChange(field: keyof IFornecedor) {

        return (valor: (string | boolean)) => setFornecedorData((prev) => {

            const newValue = (STRING_INPUT_FIELDS.includes(field))
                ? valor
                : !prev[field]

            let updatedData = {...prev, [field]: newValue}

            if (field === 'usaUnitarioPedido' && !newValue) {

                updatedData.usaComposto = false

            } else if (field === 'usaComposto' && newValue && !prev.usaUnitarioPedido) {

                return prev

            }
                
            return updatedData;
                
        })
        
    }
    
    function resetForm() {

        setFornecedorData({...INITIAL_STATE})

    }

    return {fornecedorData, setFornecedorData, handleFornecedorChange, resetForm} as useFornecedorReturn

}