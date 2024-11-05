'use client'
import { motion, AnimatePresence } from 'framer-motion'
import TableHeader from '../../calcular/TabelaSection/TabelaHeader/TabelaHeader'
import style from './PedidoDetalheSection.module.scss'
import { SearchFieldKeys } from '@/hooks/useFilter'
import SelectFornecedor from '@/components/SelectFornecedor/SelectFornecedor'
import Search from '@/components/Search/Search'
import { usePedidos } from '../context/PedidosContext'
import { ICadastro } from '@/interfaces/ICadastro'
import Tab from '@/components/Tab/Tab'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import { useMemo } from 'react'
import Highlight from '@/components/Highlight/Highlight'
import PedidoRows from '../[[...pedido]]/PedidoRows'

export default function PedidoDetalheSection(
    { pedido, id }: { pedido: ICadastro | null, id: number | null }
) {

    const { searchParam, setSearchParam, searchField, setSearchFieldCapitalized } = usePedidos()
    const fieldKeys: SearchFieldKeys[] = ['unitario', 'codigo']

    const dados = useMemo(() => {
        if (!pedido) return []
        return Object.entries(pedido).filter(([key, _]) => key !== 'produtos')
    }
    , [pedido])

    return (
        <section 
            className={style.tabelaSection} 
       
        > 
            
        <Tab 
            svg={svgsUtil.unitarioNota} 
            section={'Dados'}
        >
            {pedido
            ?
            dados.map(([key, value]) => 
                <span key={key}>
                    <h3>{key}</h3>
                    <p>{value}</p>
                </span>
            )
            :
            <div
                className={style.noMatch}
            >
                {svgsUtil.unitarioNota}
                <p> Nenhum <Highlight>pedido</Highlight> selecionado</p>
            </div>
            }
        </Tab>
        <Tab 
            svg={svgsUtil.produto} 
            section={'Produtos'}
            initialDisplay
            heightMode='100%'
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
                    {pedido
                    ?
                    <PedidoRows produtos={pedido.produtos} />
                    :
                    <div
                        className={style.noMatch}
                    >
                        {svgsUtil.unitarioNota}
                        <p> Nenhum <Highlight>pedido</Highlight> selecionado</p>
                    </div>
                    }
                    </motion.div>
                    </AnimatePresence>

                </div>

            </div>
        </Tab>


    </section>
    )

}