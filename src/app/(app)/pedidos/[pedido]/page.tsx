import { dbConnect } from "@/utils/db/supabase"
import TabelaRow from "../../calcular/TabelaSection/TabelaRow/TabelaRow"
import PedidoRows from "./PedidoRows"

export const dynamicParams = false

export async function generateStaticParams() {

    const supabase = dbConnect()
    const { data: pedidos, error } = await supabase
        .from('cadastros')
        .select('id')

    return pedidos?.map( ({ id }) => ({
        pedido: id.toString()
    })) || { pedido: '' }

}

export default async function Pedido({ params }: { params: { pedido: number }}) {

    const supabase = dbConnect()
    const { data: pedido, error } = await supabase
        .from('cadastros')
        .select('*')
        .eq('id', params.pedido)
        .limit(1)
        .single()
    
    return pedido&& <PedidoRows produtos={pedido.produtos} />

}