
import FatoresSection from './FatoresSection/FatoresSection'
import TabelaSection from './TabelaSection/TabelaSection'
import { dbConnect } from '@/utils/db/supabase'

import style from './calcular.module.scss'

export const revalidate = 0

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
        </main>
    )


}