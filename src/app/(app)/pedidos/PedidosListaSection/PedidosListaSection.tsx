'use client'
import { ICadastro } from '@/interfaces/ICadastro'
import style from './PedidosListaSection.module.scss'
import Search from '@/components/Search/Search'
import { LayoutGroup, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import capitalize from '@/utils/capitalize'

interface PedidosListaSectionProps {
    pedidos: ICadastro[]
}

export default function PedidosListaSection({ pedidos }: PedidosListaSectionProps) {

    const [searchParam, setSearchParam] = useState('')

    const pedidosDisplay = useMemo(() => 
        pedidos?.filter( pedido => pedido.fornecedor?.includes(searchParam.toLowerCase()))
    , [searchParam])

    console.table(pedidos);

    return (

        <section className={style.pedidos}>

            <header className={style.header}>

            <div className={style.title}>
                    <h3>Fornecedores</h3>
                    <p>
                        Selecione um fornecedor para conferir suas fatores e configurações:
                    </p>
                </div>

                <button className={style.novo}>
                    Novo Fornecedor
                </button>

                {/* <input type="text" placeholder='buscar' /> */}

                <Search 
                    className={style.search} 
                    searchParam={searchParam} 
                    setSearchParam={setSearchParam} 
                    textInput
                />

            </header>

            <div className={style.content}>

                    <motion.div 
                        className={style.pedidosContainer}
                        layout
                        layoutRoot
                    >
                    <LayoutGroup>
                    {
                    (pedidosDisplay.map( pedido => 
                        <Link 
                            className={style.pedido}
                            key={pedido.id} 
                            href={`/pedidos/${pedido.id}`}
                        >
                            {svgsUtil.unitarioNota}
                            <p>{pedido.id}</p>
                            <p>{pedido.fornecedor&& capitalize(pedido.fornecedor)}</p>
                            <p>{new Date(pedido.created_at).toLocaleString().split(',')[0]}</p>
                            <p>{`as ${new Date(pedido.created_at).toLocaleString().split(',')[1]}h`}</p>
                            <p>{`${pedido.produtos.length} produtos`}</p>
                        </Link>
                    ))
                    }
                    </LayoutGroup>
                    </motion.div>

            </div>

        </section>

    )

}