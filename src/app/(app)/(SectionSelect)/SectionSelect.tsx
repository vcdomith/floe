import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

import style from './SectionSelect.module.scss'
import { useCalcular } from "../calcular/context/CalcularContext";
import { usePathname } from "next/navigation";
import { sectionsByPath } from "./(sectionsByPath)/sectionsByPath";
import { toPath } from "lodash";
import Logos from "../(svg)/Logos";

export default function SectionSelect() {

    const sections = useMemo(() => ['Fatores', 'Tabela'], [])
    const {
        calcularSection: section, 
        setCalcularSection: setSection ,
    } = useCalcular()

    const path = usePathname().slice(1,)

    return (
        <span className={style.select}>
            <Logo 
                route={path} 
                styleName={style.logo}
            />
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

const Logo = (
    { route, styleName }: 
    { 
        route: string, 
        styleName?: string 
    }): React.ReactNode => {

    interface Logo {

        Svg: () => React.ReactNode
        Titulo: string
        
    }

    interface SvgLogos {

        configurar: Logo
        tabela: Logo
        calcular: Logo
        cadastros: Logo

    }

    const { SvgConfigurar, SvgTabela, SvgCadastros } = Logos

    const SvgLogos: SvgLogos = {
        
        configurar: {
            Svg: () => <SvgConfigurar />,
            Titulo: 'Configurar',
        },
        tabela: {
            Svg: () => <SvgTabela/>,
            Titulo: 'Fallback'
        },
        calcular: {
            Svg: () => <SvgTabela/>,
            Titulo: 'Calcular'
        },
        cadastros: {
            Svg: () => <SvgCadastros/>,
            Titulo: 'Cadastros'
        },
        
    }

    const { Svg, Titulo } = SvgLogos[route as keyof SvgLogos]

    return (
        <span 
            className={styleName?? ''}
        >
            <Svg />
            <p>{Titulo}</p>
        </span>
     
    )
}