import { dbConnect } from "@/utils/db/supabase"
import TabelaRow from "../../calcular/TabelaSection/TabelaRow/TabelaRow"
import PedidoRows from "./PedidoRows"
import { svgsUtil } from "@/components/SvgArray/SvgUtil"
import Highlight from "@/components/Highlight/Highlight"

import style from './pedido.module.scss'
import PedidoDetalheSection from "../PedidoDetalheSection/PedidoDetalheSection"

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
        pedido: [id.toString()]
    })) || [{ pedido: [''] }]

    pedidosParam.push({pedido: ['']})

    // console.log(pedidosParam);

    // console.log(pedidosParam);
    return pedidosParam

}

type Params = Promise<{ pedido: number }>
export default async function Pedido({ params }: { params: Params }) {

    const { pedido: pedidoParam } = await params

    const supabase = dbConnect()
    const { data: pedido, error } = await supabase
        .from('cadastros')
        .select('*')
        .eq('id', pedidoParam)
        .limit(1)
        .single()

    // console.log(params.pedido);

    return <PedidoDetalheSection pedido={pedido} id={pedidoParam}/>

    // console.log(pedido);

    // return pedido
    //     ? 
    //         <PedidoRows produtos={pedido.produtos} />
    //     : 
    //         <div
    //             className={style.noMatch}
    //         >
    //             {svgsUtil.unitarioNota}
    //             <p>Nenhum <Highlight>pedido</Highlight> com id <Highlight>{params.pedido}</Highlight> existe</p>
    //         </div>



}