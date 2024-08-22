import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { useMemo, useState } from "react";

import style from './SectionSelect.module.scss'

export default function SectionSelect() {

    const sections = useMemo(() => ['Fatores', 'Tabela'], [])
    const [section, setSection] = useState<string>('Fatores')

    return (
        <span className={style.select}>
            <SelectFornecedor 
                fornecedoresControle={sections} 
                fornecedor={section} 
                setFornecedor={setSection}                
                omitSearch
            />
        </span>
    )

}