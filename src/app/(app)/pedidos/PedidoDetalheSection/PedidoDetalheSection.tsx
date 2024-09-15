'use client'
import { motion, AnimatePresence } from 'framer-motion'
import TableHeader from '../../calcular/TabelaSection/TabelaHeader/TabelaHeader'
import style from './PedidoDetalheSection.module.scss'
import { useMemo, useState } from 'react'
import useFilter, { SearchFieldKeys } from '@/hooks/useFilter'
import SelectFornecedor from '@/components/SelectFornecedor/SelectFornecedor'
import Search from '@/components/Search/Search'

export default function PedidoDetalheSection({ children }: { children: React.ReactNode }) {

    const { searchParam, setSearchParam, searchField, setSearchFieldCapitalized } = useFilter()
    const fieldKeys: SearchFieldKeys[] = ['unitario', 'codigo']

    // const pedidoDisplay = useMemo(() => 
        
    // , [])

    return (
        // <section>

        //     <div className={style.tabela}>

        //     <TableHeader />
        //     {/* <AnimatePresence mode='popLayout'> */}
        //     <div 
        //         className={style.tabelaBody} 
        //     >
        //     {children}
        //     </div>
        //     {/* </AnimatePresence> */}

        //     </div>
        // </section>
        <section 
            className={style.tabelaSection} 
       
        > 
        <div className={style.content}>

            <span className={style.options}>
                <SelectFornecedor 
                    omitSearch={true}
                    fornecedoresControle={fieldKeys} 
                    fornecedor={searchField} 
                    setFornecedor={setSearchFieldCapitalized as (() => void)} 
                />
                <Search 
                    className={style.search} 
                    searchParam={searchParam} 
                    setSearchParam={setSearchParam} 
                    textInput={(searchField.toLowerCase() === 'codigo')}
                />
            </span>


            <div className={style.tabela}>

                <TableHeader />
                <AnimatePresence mode='popLayout'>
                <motion.div 
                    className={style.tabelaBody} 
                    layout 
                    layoutRoot
                >
                {children}
                </motion.div>
                </AnimatePresence>

            </div>

        </div>

    </section>
    )

}