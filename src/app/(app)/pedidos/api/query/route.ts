import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";

const supabase = dbConnect()

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const fornecedorQuery = searchParams.get('fornecedor')
    const periodoQuery = searchParams.get('periodo')
    const periodoString = periodoQuery ? periodoQuery.split(',') : []

    if (!fornecedorQuery) return new Response(JSON.stringify('Deve ser passado o parametro "fornecedor" para fazer a pesquisa'), {
        status: 500
    })

    console.log(fornecedorQuery);
    console.log(periodoString);

    let query = supabase
        .from('cadastros')
        .select('*')
        .ilike('fornecedor', `%${fornecedorQuery}%`)
        .order('created_at', { ascending: false })

    if (periodoString.length === 2) {
        query = query
            .gte('created_at', `${periodoString[0]}`)    
            .lte('created_at', `${periodoString[1]}`)
    }

    const { data: pedidos, error } = await query

    console.log(pedidos);

    if (error) {
        return new Response(JSON.stringify({error: error.message}), {
            status: 500
        })
    }

    return new Response(JSON.stringify(pedidos), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })

}