
import { dbConnect } from '@/utils/db/supabase'
import style from './calcular.module.scss'
import FornecedorTab from './Tabs/FornecedorTab/FornecedorTab'
import { cache } from 'react'

// const getFornecedores = cache(async () => {

//     const supabase = dbConnect()

//     try {
        
//         const { data: fornecedoresDB, error } = await supabase
//             .from('fornecedores')
//             .select('nome')

//         const fornecedores: string[] | undefined = fornecedoresDB?.map( fornecedor => fornecedor.nome )

//         console.log(fornecedores);

//         return fornecedores

//     } catch (error) {
//         console.error(error)
//     }

// })

export default async function Calcular() {

    // const fornecedores = getFornecedores()
    const supabase = dbConnect()
    const { data: fornecedoresDB } = await supabase.from('fornecedores').select('nome')
    const fornecedores: string[] | undefined = fornecedoresDB?.map( fornecedor => fornecedor.nome )

    return (
        <main
            className={style.main}
        >
            <section className={style.fatores}>
                <div className={style.content}>
                {JSON.stringify(fornecedores)}
                {fornecedores&&
                <FornecedorTab
                fornecedores={fornecedores}
                />
                }
                </div>
            </section>

            <section className={style.tabela}>
                <div className={style.content}>tabela</div>
            </section>
          
            
        </main>
    )


}