'use client'
import { motion, AnimatePresence } from 'framer-motion'
import TableHeader from '../../calcular/TabelaSection/TabelaHeader/TabelaHeader'
import style from './PedidoDetalheSection.module.scss'
import { SearchFieldKeys } from '@/hooks/useFilter'
import SelectFornecedor from '@/components/SelectFornecedor/SelectFornecedor'
import Search from '@/components/Search/Search'
import { usePedidos } from '../context/PedidosContext'

export default function PedidoDetalheSection(
    { children }: { children: React.ReactNode }
) {

    const { searchParam, setSearchParam, searchField, setSearchFieldCapitalized } = usePedidos()
    const fieldKeys: SearchFieldKeys[] = ['unitario', 'codigo']

    return (
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