import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

import style from './SectionSelect.module.scss'
import { useCalcular } from "../calcular/context/CalcularContext";

export default function SectionSelect() {

    const sections = useMemo(() => ['Fatores', 'Tabela'], [])
    const {
        calcularSection: section, 
        setCalcularSection: setSection ,
    } = useCalcular()

    return (
        <span className={style.select}>
            <SelectFornecedor 
                fornecedoresControle={sections} 
                fornecedor={section} 
                setFornecedor={setSection as Dispatch<SetStateAction<string>>}                
                omitSearch
            />
        </span>
    )

}