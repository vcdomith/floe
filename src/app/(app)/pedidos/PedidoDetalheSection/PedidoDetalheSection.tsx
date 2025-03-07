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
import capitalize from '@/utils/capitalize'
import { useModal } from '../../(contexts)/ModalContext'
import DocumentoDetalhes from '../../calcular/(metodos)/chave/ImportarChaveSection/DocumentoDetalhes/DocumentoDetalhes'
import { DocumentoImportado } from '@/hooks/useDocumento'
import { usePathname } from 'next/navigation'

export default function PedidoDetalheSection(
    { pedido, id }: { pedido: ICadastro | null, id: number | null }
) {

    const path = usePathname().slice(1,).split('/')[1]

    const { searchParam, setSearchParam, searchField, setSearchFieldCapitalized } = usePedidos()
    const fieldKeys: SearchFieldKeys[] = ['unitario', 'codigo']

    const { setModal } = useModal()

    const dados = useMemo(() => {
        if (!pedido) return []
        return Object.entries(pedido).filter(([key, _]) => key !== 'produtos' && key !== 'documentos')
    }
    , [pedido])

    
    const handleDocumentoClick = (documento: DocumentoImportado | undefined) => {

        if (documento === null || documento === undefined) return

        setModal(
            <DocumentoDetalhes documento={documento}/>
        )

    }

    return (
        <section 
            className={style.tabelaSection}
            data-invisible={path === undefined} 
        > 
            
        <Tab 
            svg={svgsUtil.unitarioNota} 
            section={'Dados'}
        >
            <div 
                className={style.dados}
                data-empty={!pedido}
            >
            {pedido
            ?
            <>
            {dados.filter(([key, value]) => key !== 'created_at').map(([key, value]) => 
                <span key={key} className={style.dado}>
                    <h3>{key}:</h3>
                    <p>{capitalize(value)}</p>
                </span>
            )}
                
                <span className={style.dado}>
                    <h3>quantidade</h3>
                    <p>{pedido.produtos.length} {pedido.produtos.length > 1 ? 'produtos' : 'produto'}</p>
                </span>
                <span className={style.dado}>
                    <h3>criado em:</h3>
                    <div className={style.data}>
                        <p>{new Date(pedido.created_at).toLocaleString().split(',')[0]}</p>
                        <p>as {new Date(pedido.created_at).toLocaleString().split(',')[1]} h</p>
                    </div>
                </span>
            <span className={`${style.dado} ${style.documento}`}>
                    <div>
                        <h3>NFe</h3>
                        <p>{(pedido.documentos) 
                            ? '#' + pedido.documentos?.nfe.numero
                            : '••••••'
                        }</p>
                    </div>
                    <button
                        onClick={() => handleDocumentoClick(pedido.documentos?.nfe)}
                        disabled={(pedido.documentos === null)}
                    >{svgsUtil.unitarioNota}</button>
                </span>
                <span className={`${style.dado} ${style.documento}`}>
                    <div>
                        <h3>CTe</h3>
                        <p>{(pedido.documentos) 
                            ? '#' + pedido.documentos?.cte.numero
                            : '••••••'
                        }</p>
                    </div>
                    <button
                        onClick={() => handleDocumentoClick(pedido.documentos?.cte)}
                        disabled={(pedido.documentos === null)}
                    >{svgsUtil.unitarioNota}</button>
                </span>
            </>
            :
            <div
                className={`${style.noMatch} ${style.noMatchDados}`}
            >
                {svgsUtil.unitarioNota}
                <p> Nenhum <Highlight>pedido</Highlight> selecionado</p>
            </div>
            }
            </div>
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