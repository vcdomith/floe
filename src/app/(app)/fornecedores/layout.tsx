import { dbConnect } from '@/utils/db/supabase'
import style from './fornecedores.module.scss'
import FornecedoresSection from './FornecedoresSection/FornecedoresSection'
import DetalheSection from './DetalheSection/DetalheSection'

export default async function Configurar({ children }:{ children: React.ReactNode }){

    const supabase = dbConnect()
    const { data: fornecedores, error } = await supabase.from('fornecedores').select('id,nome')

    return (
        <main
            className={style.main}
        >
            <FornecedoresSection 
                fornecedores={fornecedores?? undefined} 
            />
            <DetalheSection>
                {children}
            </DetalheSection>
        </main>
    )

}