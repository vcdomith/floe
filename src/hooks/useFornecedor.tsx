import { IFornecedor } from "@/interfaces/IFornecedor";
import getDifferentKeys from "@/utils/differentKeys";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

export interface UseFornecedor {

    fornecedorData: IFornecedor
    setFornecedorData: Dispatch<SetStateAction<IFornecedor>>
    handleFornecedorChange: <T>(field: keyof IFornecedor) => (valor: T) => void
    resetFornecedor: () => void

    fornecedorDiff: (keyof IFornecedor)[]
    fornecedorControl: IFornecedor | undefined
    updateFornecedorControl: Dispatch<SetStateAction<IFornecedor | undefined>>
    rollbackFornecedor: () => void
    resetFornecedorControl: () => void

}

const STRING_INPUT_FIELDS: (keyof IFornecedor)[] = ['nome', 'nomeFantasia', 'cnpj', 'fatorBase', 'fatorBaseNormal', 'fatorBaseST']
const INITIAL_STATE: IFornecedor = {
    nome: '',
    nomeFantasia: '',
    cnpj: '',
    fatorBase: '',
    fatorBaseNormal: '',
    fatorBaseST: '',
    usaTransporte: true,
    usaSt: true,
    usaDesconto: false,
    usaIpi: false,
    usaIpiProporcional: false,
    usaUnitarioPedido: false,
    usaComposto: false,
}

export default function useFornecedor(): UseFornecedor {

    const [fornecedorData, setFornecedorData] = useState<IFornecedor>(INITIAL_STATE)

    const [fornecedorControl, updateFornecedorControl] = useState<IFornecedor>()

    const resetFornecedorControl = () => {
        updateFornecedorControl(undefined)
    }

    const rollbackFornecedor = () => setFornecedorData((prev) => {
        return fornecedorControl
        ? fornecedorControl
        : {...prev}
    })

    function handleFornecedorChange<T>(field: keyof IFornecedor) {

        return (valor: T) => setFornecedorData((prev) => {

            const newValue = (STRING_INPUT_FIELDS.includes(field))
                ? valor
                : !prev[field]

            let updatedData = {...prev, [field]: newValue}

            if (field === 'usaIpi' && !newValue) {

                updatedData.usaIpiProporcional = false
                
            } else if ( field === 'usaIpiProporcional' && newValue && !prev.usaIpi) {

                return prev

            }

            if (field === 'usaUnitarioPedido' && !newValue) {

                updatedData.usaComposto = false

            } else if (field === 'usaComposto' && newValue && !prev.usaUnitarioPedido) {

                return prev

            }
                
            return updatedData;
                
        })
        
    }
    
    function resetFornecedor() {

        setFornecedorData({...INITIAL_STATE})

    }

    const fornecedorDiff: (keyof IFornecedor)[] = useMemo(() => {
        if (fornecedorControl) return getDifferentKeys(fornecedorData, fornecedorControl)
        return []
    }
    , [fornecedorData, fornecedorControl])

    return {
        fornecedorData, 
        setFornecedorData,
        handleFornecedorChange, 
        resetFornecedor,

        fornecedorDiff,
        fornecedorControl,
        updateFornecedorControl,
        rollbackFornecedor,
        resetFornecedorControl,
    }

}