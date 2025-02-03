import { dbConnect } from "@/utils/db/supabase"
import FatoresSection from "../../FatoresSection/FatoresSection"

const supabase = dbConnect()

export default async function CalcularManual() {

    // const fornecedores = getFornecedores()
    const { data: fornecedoresDB } = await supabase.from('fornecedores').select('nome')
    const fornecedores: string[] | undefined = fornecedoresDB?.map( fornecedor => fornecedor.nome )

    return <FatoresSection fornecedores={(fornecedores !== null) ? fornecedores : []} />

}