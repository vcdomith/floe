'use client'
import { ICadastro } from '@/interfaces/ICadastro'
import style from './PedidosListaSection.module.scss'
import Search from '@/components/Search/Search'
import { LayoutGroup, motion } from 'framer-motion'
import { forwardRef, Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import capitalizeInner from '@/utils/capitalize'
import { usePathname } from 'next/navigation'
import { useBackgroundSync } from '../../(contexts)/BackgroundSyncContext'
import Highlight from '@/components/Highlight/Highlight'
import LogoSvg from '@/components/SvgArray/LogoSvg'

interface PedidosListaSectionProps {
    pedidos: ICadastro[]
    pedidosLength: number
}

export default function PedidosListaSection({ pedidos: pedidosInitial, pedidosLength }: PedidosListaSectionProps) {

    const path = usePathname().slice(1,).split('/')[1]

    const [pedidos, setPedidos] = useState(pedidosInitial)
    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(10)

    const [searchParam, setSearchParam] = useState('')

    const pedidosDisplay = useMemo(() => 
        pedidos?.filter( pedido => pedido.fornecedor?.includes(searchParam.toLowerCase()))
    , [pedidos, searchParam])

    const handleLoadMore = async () => {

        setLoading(true)

        const res = await fetch(`/pedidos/api/loadMore?offset=${offset}`)
        const pedidosExtra = await res.json()
        
        if(pedidosExtra) console.log(pedidosExtra);

        setPedidos( prev => [...prev, ...pedidosExtra] )
        setOffset( prev => prev + 10 )
        setLoading(false)

    }

    return (

        <section className={style.pedidos}>

            <header className={style.header}>

            <div className={style.title}>
                    <h3>Pedidos:</h3>
                    <p>
                        Selecione um pedido para conferir seus produtos e fatores:
                    </p>
                </div>

                <span className={style.links}>
                    <Link 
                        className={style.novo}
                        href={'/calcular/chave'}
                        prefetch
                    >
                        {svgsUtil.unitarioNota}
                        Importar
                    </Link>
                    <Link 
                        className={style.novo}
                        href={'/calcular/manual'}
                        prefetch
                    >
                        {svgsUtil.plus}
                        Calcular
                    </Link>
                </span>

                {/* 
                    <input type="text" placeholder='buscar' /> */
                }

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
                        initial={false}
                        layout
                        layoutRoot
                    >
                    <LayoutGroup>
                    {
                    (pedidosDisplay.length > 0)
                    ?
                    (pedidosDisplay.map( pedido => 
                        <PedidoLink 
                            key={pedido.id.toString()}
                            pedido={pedido}
                            path={path}
                        />
                    ))
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
                        {svgsUtil.unitarioNota}
                        <p>Nenhum <Highlight>pedido</Highlight> corresponde à pesquisa</p>
                    </motion.div>
                    }

                    {
                    (pedidosDisplay.length === pedidos.length)&& 
                    pedidosDisplay.length < pedidosLength&&
                    <button
                        className={style.load}
                        onClick={() => handleLoadMore()}
                        disabled={loading}
                    >{
                    (loading)
                        ?
                            <>
                            <LogoSvg loop/>
                            Carregando...
                            </>
                        : 
                            'Carregar Mais'
                    }</button>
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
            transition={{ duration: 0.2 }}

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
                <p className={style.fornecedor}>{pedido.fornecedor&& capitalizeInner(pedido.fornecedor)}</p>
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