'use client'
import { ProdutoCadastro } from "../../calcular/context/CalcularContext";
import { useMemo } from "react";
import TabelaRow from "../../calcular/TabelaSection/TabelaRow/TabelaRow";
import { usePedidos } from "../context/PedidosContext";
import { motion } from 'framer-motion'
import { svgsUtil } from "@/components/SvgArray/SvgUtil";

import style from './PedidoRows.module.scss'
import Highlight from "@/components/Highlight/Highlight";

export default function PedidoRows({ produtos }: { produtos: ProdutoCadastro[] }) {

    const { searchParam, searchField } = usePedidos()

    const pedido = useMemo(() => 
        produtos.filter( produto => (produto[searchField.toLowerCase() as keyof ProdutoCadastro] as string).includes(searchParam) )
    , [searchField, searchParam])

    return (pedido.length > 0)
    ? pedido.map( produto =>
        <TabelaRow 
            key={produto.id}
            produto={produto}
            editable={false}
        />)
    : 
    <motion.div
        className={style.noMatch}

        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.2 }}

        layout='position'
        layoutScroll
    >
        {svgsUtil.produto}
        <p>Nenhum <Highlight>produto</Highlight> corresponde à pesquisa</p>
    </motion.div>
    
}