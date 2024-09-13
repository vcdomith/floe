import { dbConnect } from "@/utils/db/supabase"
import TabelaRow from "../../calcular/TabelaSection/TabelaRow/TabelaRow"
import { SetStateAction, useMemo } from "react"
import { ProdutoCadastro } from "../../calcular/context/CalcularContext"

export default async function Pedido({ params, searchParam, searchField }: { params: { pedido: number }, searchParam: string, searchField: string }) {

    const supabase = dbConnect()
    const { data: pedidos, error } = await supabase
        .from('cadastros')
        .select('*')
        .eq('id', params.pedido)

    // const pedidosDisplay = useMemo(() => 
    //     pedidos?.filter( pedido => (pedido[searchField as keyof typeof pedido] as string).includes(searchParam))
    // , [searchParam, searchField])

    // const pedidosDisplay = pedidos?.filter( pedido => (pedido[searchField as keyof typeof pedido] as string).includes(searchParam))


    return (
        <>
        {pedidos?.map( pedido => 
            pedido.produtos.map( produto => 
                <TabelaRow
                    key={pedido.id} 
                    produto={produto} 
                />
            ))}
        </>
    )

}