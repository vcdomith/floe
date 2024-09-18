import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";

const supabase = dbConnect()

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const fornecedorQuery = searchParams.get('fornecedor')
    
    if (!fornecedorQuery) return new Response('No searchParam was supplied', {
        status: 400
    })

    const { data: fornecedor, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('nome', fornecedorQuery.toLowerCase())
        .limit(1)
        .single()

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500
        })
    }

    return new Response(JSON.stringify(fornecedor), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })

}