import { IProduto } from "@/interfaces/IProduto"
import { dbConnect } from "@/utils/db/supabase"
import { createClient } from "@supabase/supabase-js"

export default async function Cadastros() {
    
    const supabase = dbConnect()
    const {data: cadastros} = await supabase.from('cadastros').select()

    // const 

    return (
    <>
    <div
        style={{
            width: '200px',
            height: '200px',
            backgroundColor: 'wheat'
        }}
    >
        {cadastros?.map( ({id, created_at, produtos}) => 
            <div key={id}>
                <p>{created_at}</p>
                {produtos.map(({ id, unitario, fatores }: IProduto) => 
                    <div key={id}>
                        <p>{unitario}</p>
                    </div>
                )}
            </div>
        )}
    </div>
    </>
    )

}
