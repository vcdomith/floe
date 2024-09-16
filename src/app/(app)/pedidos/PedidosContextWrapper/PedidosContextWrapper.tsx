'use client'

import { ICadastro } from "@/interfaces/ICadastro"
import PedidoDetalheSection from "../PedidoDetalheSection/PedidoDetalheSection"
import PedidosListaSection from "../PedidosListaSection/PedidosListaSection"
import { PedidosProvider } from "../context/PedidosContext"
import { usePathname } from "next/navigation"

export default function PedidosContextWrapper({ pedidos, children }: { pedidos: (ICadastro[] | null), children: React.ReactNode }) {

    return (
        <PedidosProvider>

            <PedidosListaSection pedidos={(pedidos !== null) ? pedidos : []}/>
                
            <PedidoDetalheSection>
                {children}
            </PedidoDetalheSection>

        </PedidosProvider>
    )


}