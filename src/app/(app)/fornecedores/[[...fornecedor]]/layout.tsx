import { dbConnect } from '@/utils/db/supabase'
import style from './configurar.module.scss'
import FornecedoresSection from '../FornecedoresSection/FornecedoresSection'
import DetalheSection from '../DetalheSection/DetalheSection'

export default async function Configurar({ children, params }:{ children: React.ReactNode, params: { fornecedor: string[] } }){

    const supabase = dbConnect()
    const { data: fornecedores, error } = await supabase.from('fornecedores').select('id,nome')

    return (
        <main
            className={style.main}
        >
            <FornecedoresSection 
                fornecedores={fornecedores?? undefined} 
                path={params.fornecedor}
            />
            <DetalheSection>
                {children}
            </DetalheSection>
        </main>
    )

}