'use client'
import { ICadastro } from '@/interfaces/ICadastro'
import style from './PedidosListaSection.module.scss'
import Search from '@/components/Search/Search'
import { LayoutGroup, motion } from 'framer-motion'
import { forwardRef, useMemo, useState } from 'react'
import Link from 'next/link'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import capitalize from '@/utils/capitalize'
import { usePathname } from 'next/navigation'

interface PedidosListaSectionProps {
    pedidos: ICadastro[]
}

export default function PedidosListaSection({ pedidos }: PedidosListaSectionProps) {

    const path = usePathname().slice(1,).split('/')[1]

    const [searchParam, setSearchParam] = useState('')

    const pedidosDisplay = useMemo(() => 
        pedidos?.filter( pedido => pedido.fornecedor?.includes(searchParam.toLowerCase()))
    , [searchParam])


    return (

        <section className={style.pedidos}>

            <header className={style.header}>

            <div className={style.title}>
                    <h3>Pedidos:</h3>
                    <p>
                        Selecione um pedido para conferir seus produtos e fatores:
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
                    pedidosDisplay&&
                    (pedidosDisplay.map( pedido => 
                        <PedidoLink 
                            key={pedido.id.toString()}
                            pedido={pedido}
                            path={path}
                        />
                    ))
                    }
                    </LayoutGroup>
                    </motion.div>

            </div>

        </section>

    )

}

interface PedidoLinkProps {
    pedido: ICadastro
    path: string
    key: string
}

const PedidoLink = forwardRef<HTMLDivElement, PedidoLinkProps>(function FornecedorLink({ pedido, path, key }: PedidoLinkProps, ref) {

    return (
        <motion.div
            key={key}
            ref={ref}

            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}

            layout='position'
            layoutScroll
        >
            <Link 
                className={style.pedido}
                key={pedido.id} 
                href={`/pedidos/${pedido.id}`}
                data-selected={ path === pedido.id.toString() }
            >
                {svgsUtil.unitarioNota}
                <p className={style.id}>{pedido.id}</p>
                <p>{pedido.fornecedor&& capitalize(pedido.fornecedor)}</p>
                <span className={style.composto}>
                    <p className={style.data}>
                        {new Date(pedido.created_at).toLocaleString().split(',')[0]}
                    </p>
                    <p className={style.horas}>
                        {`as ${new Date(pedido.created_at).toLocaleString().split(',')[1]}h`}
                    </p>
                </span>
                {/* <p>{`${pedido.produtos.length} produtos`}</p> */}
            </Link>
        </motion.div>
    )

}) 