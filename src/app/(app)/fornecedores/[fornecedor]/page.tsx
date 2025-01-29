import capitalizeInner from "@/utils/capitalize";
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

    const test = fornecedoresParams.some(
        fornecedor => fornecedor.fornecedor.includes('%20')
    )
    // console.log(fornecedoresParams, test);

    return fornecedoresParams

}

type Params = Promise<{ fornecedor: string }>

export default async function Fornecedor( { params }: { params: Params }) {

    const { fornecedor: fornecedorParam } = await params 

    const supabase = dbConnect()
    const { data: fornecedor, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('nome', fornecedorParam.replaceAll('%20', ' '))

    if (error) {
        console.error('Error fetching data', error)
        return <p>{JSON.stringify(error)}</p>
    }

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