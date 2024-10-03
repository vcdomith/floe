import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";

const supabase = dbConnect()

export async function GET(request: NextRequest) {

    try {
        
        const searchParam = request.nextUrl.searchParams
        const cnpjQuery = searchParam.get('fornecedor')

        if (!cnpjQuery) return new Response('No searchParam "fornecedor" was supplied', {
            status: 400
        })

        const { data: fornecedor, error } = await supabase
            .from('fornecedores')
            .select('*')
            .eq('cnpj', cnpjQuery)
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