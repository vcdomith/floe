import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import style from './SectionSelect.module.scss'
import Logos from "../(svg)/Logos";
import { useSectionSelect } from "../(contexts)/SectionSelectContext";

const VALID_ROUTES = ['configurar', 'calcular', 'tabela', 'cadastros']

export default function SectionSelect() {

    const { path, sections, section, handleSectionChange } = useSectionSelect()

    return (
        <span className={style.select}>
            {/* <Logo 
                route={path} 
                styleName={style.logo}
            /> */}
            <SelectFornecedor 
                fornecedoresControle={sections} 
                // fornecedoresControle={sections} 
                fornecedor={section} 
                setFornecedor={handleSectionChange}                
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

    let index = (VALID_ROUTES.includes(route)) 
        ? route
        : 'configurar'

    const { Svg, Titulo } = SvgLogos[index as keyof SvgLogos]

    return (
        <span 
            className={styleName?? ''}
        >
            <Svg />
            <p>{Titulo}</p>
        </span>
     
    )
}