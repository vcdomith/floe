import FornecedorTab from "../Tabs/FornecedorTab/FornecedorTab";
import PedidoTab from "../Tabs/PedidoTab/PedidoTab";

import style from './FatoresSection.module.scss'

interface FatoresSectionProps {

    fornecedores: string[] | undefined

}

export default function FatoresSection({ fornecedores }: FatoresSectionProps) {

    return (
        <section className={style.fatores}>
            <div className={style.content}>
    
                <div className={style.title}>
                    <h3>Fornecedor</h3>
                    <p>Selecione o fornecedor para acessar os fatores e configurações para calcular as tabelas:</p>
                </div>
                {fornecedores&&
                <div className={style.tabContainer}>
                    <FornecedorTab
                    fornecedores={fornecedores}
                    />
                </div>
                }

                <div className={style.title}>
                    <h3>Fatores</h3>
                    <p>Selecione o fornecedor para acessar os fatores e configurações para calcular as tabelas:</p>
                </div>
                {fornecedores&&
                <div className={style.tabContainer}>
                    <PedidoTab />
                    <FornecedorTab
                    fornecedores={fornecedores}
                    svg={<SvgProduto/>}
                    titulo='Produto'
                    />
                </div>
                }

            </div>
        </section>
    )

}

const SvgProduto = () => {
    return(
        <svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 150.278 180.487 198.278 211.82" stroke="#591C4A" strokeWidth="40"/>
        <path d="M474.07 98.893C465.57 92.393 350.07 7.89299 305.57 43.893C261.07 79.893 498.57 212.393 474.07 298.893C454.47 368.093 353.57 322.726 305.57 291.393" stroke="#591C4A" strokeWidth="40"/>
        <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
        </svg>
    )
}