import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";

const supabase = dbConnect()

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('fornecedor')

    if (!query) return new Response(JSON.stringify('Deve ser passado o parametro "fornecedor" para fazer a pesquisa'), {
        status: 500
    })

    console.log(query);

    const { data: pedidos, error } = await supabase
        .from('cadastros')
        .select('*')
        .ilike('fornecedor', `%${query}%`)
        .order('created_at', { ascending: false })

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