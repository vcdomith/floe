'use client'
import useFilter from "@/hooks/useFilter";
import { ProdutoCadastro } from "../../calcular/context/CalcularContext";
import { useMemo } from "react";
import TabelaRow from "../../calcular/TabelaSection/TabelaRow/TabelaRow";
import { usePedidos } from "../context/PedidosContext";

export default function PedidoRows({ produtos }: { produtos: ProdutoCadastro[] }) {

    const { searchParam, setSearchParam, searchField, setSearchFieldCapitalized } = usePedidos()

    const pedido = useMemo(() => 
        produtos.filter( produto => (produto[searchField.toLowerCase() as keyof ProdutoCadastro] as string).includes(searchParam) )
    , [searchField, searchParam])

    return pedido.map( produto =>
        <TabelaRow 
            key={produto.id}
            produto={produto}
        />
    )

}