import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";

const supabase = dbConnect()

export async function GET(request: NextRequest) {

    let offset: number = 0

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('offset')
    if (query !== null) offset = parseInt(query)

    const { data: pedidos, error } = await supabase
        .from('cadastros')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, (9 + offset))

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