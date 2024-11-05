'use client'

import { ICadastro } from "@/interfaces/ICadastro"
import PedidoDetalheSection from "../PedidoDetalheSection/PedidoDetalheSection"
import PedidosListaSection from "../PedidosListaSection/PedidosListaSection"
import { PedidosProvider } from "../context/PedidosContext"
import { usePathname } from "next/navigation"

interface IPedidoContextWrapperProps {

    children: React.ReactNode
    pedidos: (ICadastro[] | null)
    pedidosLength: number

}

export default function PedidosContextWrapper(
    { children, pedidos, pedidosLength }: IPedidoContextWrapperProps) {

    return (
        <PedidosProvider>

            <PedidosListaSection 
                pedidos={(pedidos !== null) ? pedidos : []}
                pedidosLength={pedidosLength}
            />

            {children}

            {/* <PedidoDetalheSection>
                {children}
            </PedidoDetalheSection> */}

        </PedidosProvider>
    )


}