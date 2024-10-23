import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";
import { FornecedorQueryType } from "../../Tabs/FornecedorTab/FornecedorTab";

const supabase = dbConnect()

export async function GET(request: NextRequest) {

    try {
        
        const searchParam = request.nextUrl.searchParams
        const type = searchParam.get('type') as FornecedorQueryType | null

        if (!type) return new Response('You must pass the type searchParam to be able to query the DB', {
            status: 400
        })

        const query = searchParam.get(type)

        if (!query) return new Response('No searchParam "cnpj" was supplied', {
            status: 400
        })

        const { data: fornecedor, error } = await supabase
            .from('fornecedores')
            .select('*')
            .eq(type, query)
            .single()

        if (error) return new Response(JSON.stringify({ error: error.message }), { 
            status: 500 
        })

        return new Response(JSON.stringify(fornecedor), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })

    } catch (error) {
        
        return new Response(JSON.stringify(error), {
            status: 500
        })

    }

}