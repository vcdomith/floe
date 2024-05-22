'use client'

import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import capitalize from "@/utils/capitalize";
import { useState } from "react";

interface FornecedorTabProps {

    fornecedores: string[]

}

export default function FornecedorTab({ fornecedores }: FornecedorTabProps) {

    const [fornecedor, setFornecedor] = useState('')
    const setCapitalizedFornecedor = (value: string) => {
        setFornecedor(capitalize(value))
    }
    const [loading, setLoading] = useState(false)

    return (
        <span>
            {/* svg */}
            <h3>fornecedor</h3>
            <SelectFornecedor 
                loading={loading}
                fornecedoresControle={fornecedores}
                fornecedor={fornecedor}
                setFornecedor={setCapitalizedFornecedor}
            />
            {/* botao selecionar > svg expandir */}
        </span>
    )

}