
import { dbConnect } from '@/utils/db/supabase'
import style from './calcular.module.scss'
import FornecedorTab from './Tabs/FornecedorTab/FornecedorTab'
import PedidoTab from './Tabs/PedidoTab/PedidoTab'
import { CalcularProvider } from './context/CalcularContext'
import FatoresSection from './FatoresSection/FatoresSection'
import TabelaSection from './TabelaSection/TabelaSection'
import { useCallback } from 'react'

export default async function Calcular() {
    
    const supabase = dbConnect()
    // const fornecedores = getFornecedores()
    const { data: fornecedoresDB } = await supabase.from('fornecedores').select('nome')
    const fornecedores: string[] | undefined = fornecedoresDB?.map( fornecedor => fornecedor.nome )

    return (
        <main
            className={style.main}
        >
            <FatoresSection fornecedores={fornecedores} />
            <TabelaSection />

            {/* <section className={style.fatores}>
                <div className={style.content}>
        
                    <div className={style.title}>
                        <h3>Fornecedor</h3>
                        <p>Selecione o fornecedor para acessar os fatores e configurações para calcular as tabelas:</p>
                    </div>

                {fornecedores&&
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <PedidoTab />
                <FornecedorTab
                fornecedores={fornecedores}
                svg={<SvgProduto/>}
                titulo='Produto'
                />
                </div>
                }
                </div>
            </section> */}

            {/* <section className={style.tabela}>
                <div className={style.content}>tabela</div>
            </section> */}
          
            
        </main>
    )


}

const SvgUnitarioNota = () => {
    return (
        <svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M87.8767 246.979C-2.61686 155.99 178.37 155.99 87.8767 65L421.877 65C512.37 155.99 331.383 155.99 421.877 246.979C512.37 337.969 326.871 342.506 417.866 434L83.866 434C-7.12898 342.506 178.37 337.969 87.8767 246.979Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <line x1="160" y1="159" x2="339" y2="159" stroke="black" strokeWidth="40"/>
            <line x1="177" y1="257" x2="356" y2="257" stroke="black" strokeWidth="40"/>
            <line x1="153" y1="351" x2="332" y2="351" stroke="black" strokeWidth="40"/>
        </svg>
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