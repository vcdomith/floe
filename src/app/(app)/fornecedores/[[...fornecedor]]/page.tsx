import capitalize from "@/utils/capitalize";
import { dbConnect } from "@/utils/db/supabase";
import { notFound, redirect } from "next/navigation";

export const dynamicParams = false

export async function generateStaticParams() {

    const supabase = dbConnect()
    const { data: fornecedores, error } = await supabase.from('fornecedores').select('nome')

    const fornecedoresParams = fornecedores
        ?.map( ({ nome }) => ({
        fornecedor: [nome]
    }))

    fornecedoresParams?.push({
        fornecedor: ['']
    })

    return fornecedoresParams

}

export default function Fornecedor( { params }: { params: { fornecedor: string }}) {

    const { fornecedor } = params 
    // if( params.fornecedor !== undefined && params.fornecedor.length >= 2) redirect(`/fornecedores/${params.fornecedor[0]}`)

    // notFound()

    return (
        <div>
            {(fornecedor !== undefined)
            ? `Fornecedor ${capitalize(fornecedor)}`
            : 'Nenhum fornecedor escolhido'
            }
            
        </div>
    )

}