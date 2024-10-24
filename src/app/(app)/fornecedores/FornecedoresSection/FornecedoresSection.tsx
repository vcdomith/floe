'use client'
import Link from 'next/link'
import style from './FornecedoresSection.module.scss'
import capitalizeInner from '@/utils/capitalize'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Search from '@/components/Search/Search'
import { usePathname } from 'next/navigation'
import { forwardRef, Suspense, useMemo, useState } from 'react'
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import Highlight from '@/components/Highlight/Highlight'

interface FatoresSectionProps {

    fornecedores: { id: number, nome: string | null }[] | undefined

}

export default function FornecedoresSection({ fornecedores } : FatoresSectionProps) {

    const path = usePathname().slice(1,).split('/')[1]?.replaceAll('%20', ' ')
    console.log(path);

    const [searchParam, setSearchParam] = useState('')

    const fornecedoresDisplay = useMemo(() => 
        fornecedores?.filter( fornecedor => fornecedor.nome?.includes(searchParam.toLowerCase()))
    , [searchParam])

    return (
        <section className={style.fornecedores}>

            <header className={style.header}>

                <div className={style.title}>
                    <h3>Fornecedores</h3>
                    <p>
                        Selecione um fornecedor para conferir suas fatores e configurações:
                    </p>
                </div>

                <button className={style.novo}>
                    {svgsUtil.plus}
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
                    className={style.fornecedoresContainer} 
                    
                    layout 
                    layoutRoot
                    >
                    <LayoutGroup>
                {/* <AnimatePresence mode='popLayout'> */}
                {
                (fornecedoresDisplay && fornecedoresDisplay.length > 0)
                ?
                (fornecedoresDisplay?.map( fornecedor =>
                    <FornecedorLink 
                        key={fornecedor.id}
                        fornecedor={fornecedor}
                        path={path}
                    /> 
                    // <Link 
                    //     className={style.fornecedor}
                    //     data-selected={path === fornecedor.nome}
                    //     key={fornecedor.id} 
                    //     href={`/fornecedores/${fornecedor.nome}`} 
                    //     prefetch
                    // >
                    //     {svgsUtil.transporte}
                    //     <p>{fornecedor.id}</p>
                    //     <p>{fornecedor.nome&& capitalize(fornecedor.nome)}</p>
                    // </Link>
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
                    {svgsUtil.transporte}
                    <p>Nenhum <Highlight>fornecedor</Highlight> corresponde à pesquisa</p>
                </motion.div>
                }
                {/* </AnimatePresence> */}
                </LayoutGroup>
                </motion.div>

            </div>
        </section>
    )

}

interface FornecedorLinkProps {
    fornecedor: { id: number , nome: string | null}
    path: string
    key: string | number
}

const FornecedorLink = forwardRef<HTMLDivElement, FornecedorLinkProps>(function FornecedorLink({ fornecedor, path, key }: FornecedorLinkProps, ref) {

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
                className={style.fornecedor}
                data-selected={path === fornecedor.nome}
                key={fornecedor.id} 
                href={`/fornecedores/${fornecedor.nome}`} 
                prefetch
            >
                {svgsUtil.transporte}
                <p>{fornecedor.id}</p>
                <p>{fornecedor.nome&& capitalizeInner(fornecedor.nome)}</p>
            </Link>
        </motion.div>
    )

}) 