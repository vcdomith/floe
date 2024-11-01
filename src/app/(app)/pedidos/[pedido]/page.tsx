import { dbConnect } from "@/utils/db/supabase"
import TabelaRow from "../../calcular/TabelaSection/TabelaRow/TabelaRow"
import PedidoRows from "./PedidoRows"
import { svgsUtil } from "@/components/SvgArray/SvgUtil"
import Highlight from "@/components/Highlight/Highlight"

import style from './pedido.module.scss'

export const dynamicParams = true

export async function generateStaticParams() {

    const supabase = dbConnect()
    const { data: pedidos, error } = await supabase
        .from('cadastros')
        .select('id')
        .order('id', { ascending: false })
        .range(0, 9)

    const pedidosParam = pedidos
        ?.map( ({ id }) => ({
        pedido: id.toString()
    })) || [{ pedido: '' }]

    // console.log(pedidosParam);
    return pedidosParam

}

export default async function Pedido({ params }: { params: { pedido: number }}) {

    const supabase = dbConnect()
    const { data: pedido, error } = await supabase
        .from('cadastros')
        .select('*')
        .eq('id', params.pedido)
        .limit(1)
        .single()

    console.log(pedido);

    return pedido
        ? 
            <PedidoRows produtos={pedido.produtos} />
        : 
            <div
                className={style.noMatch}
            >
                {svgsUtil.unitarioNota}
                <p>Nenhum <Highlight>pedido</Highlight> com id <Highlight>{params.pedido}</Highlight> existe</p>
            </div>

}