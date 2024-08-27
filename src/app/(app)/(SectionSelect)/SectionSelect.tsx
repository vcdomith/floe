import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

import style from './SectionSelect.module.scss'
import { useCalcular } from "../calcular/context/CalcularContext";
import { usePathname } from "next/navigation";
import { sectionsByPath } from "./(sectionsByPath)/sectionsByPath";
import { toPath } from "lodash";

export default function SectionSelect() {

    const sections = useMemo(() => ['Fatores', 'Tabela'], [])
    const {
        calcularSection: section, 
        setCalcularSection: setSection ,
    } = useCalcular()

    const path = usePathname().slice(1,)

    return (
        <span className={style.select}>
            <SelectFornecedor 
                fornecedoresControle={(sectionsByPath[path as keyof typeof sectionsByPath])} 
                // fornecedoresControle={sections} 
                fornecedor={section} 
                setFornecedor={setSection as Dispatch<SetStateAction<string>>}                
                omitSearch
            />
        </span>
    )

}