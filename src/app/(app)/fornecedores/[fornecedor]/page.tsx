import capitalize from "@/utils/capitalize";
import { dbConnect } from "@/utils/db/supabase";
import { notFound, redirect } from "next/navigation";

export const dynamicParams = false

export async function generateStaticParams() {

    const supabase = dbConnect()
    const { data: fornecedores, error } = await supabase.from('fornecedores').select('nome')

    const fornecedoresParams = fornecedores
        ?.map( ({ nome }) => ({
        fornecedor: nome
    })) || [{ fornecedor: '' }]
    // const fornecedoresParams = fornecedores
    //     ?.map( ({ nome }) => ({
    //     fornecedor: nome?.replaceAll(' ', '%20')
    // }))
    // const fornecedoresParams = fornecedores
    //     ?.map( ({ nome }) => ({
    //     fornecedor: encodeURIComponent(nome || '')
    // })) || [{ fornecedor: ''}]
    console.log(fornecedoresParams);

    // const a = (fornecedoresParams !== undefined)
    //     ? fornecedores!
    //     .map( ({ nome }) => ({
    //     fornecedor: nome?.replaceAll(' ', '%20')
    // }))
    //     : [{
    //         fornecedor: ''
    //     }]

    // console.log(a);
    return fornecedoresParams

    // fornecedoresParams?.push({
    //     fornecedor: ['']
    // })

    // return fornecedoresParams

}

export default async function Fornecedor( { params }: { params: { fornecedor: string }}) {

    const { fornecedor: fornecedorParam } = params 
    console.log(fornecedorParam.replaceAll('%20', ' '));

    const supabase = dbConnect()
    const { data: fornecedor, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('nome', encodeURIComponent(fornecedorParam || ''))

    return (
        <div>
            {(fornecedorParam !== undefined)
            // ? `Fornecedor ${capitalize(JSON.stringify(fornecedor[0]) ?? '')}`
            ? (
                <div>
                    {fornecedor?.map( fornecedor => 
                        Object.entries(fornecedor).map( ([key, value]) => 
                            <div key={key} style={{ display: 'flex', gap: '1rem' }}>
                                <p>{key}</p>
                                <p>{value}</p>
                            </div>
                        )
                    )}
                </div>
            )
            : 'Nenhum fornecedor escolhido'
            }
            
        </div>
    )

}