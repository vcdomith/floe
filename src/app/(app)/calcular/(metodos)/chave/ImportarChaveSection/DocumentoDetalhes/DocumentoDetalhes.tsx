import { DocumentoImportado } from '@/hooks/useDocumento'
import style from './DocumentoDetalhes.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Config from '@/app/(app)/configurar/(Config)/Config'
import { chaveFormatSplit } from '@/utils/documentosFormat'
import Highlight from '@/components/Highlight/Highlight'
import { MouseEvent, SetStateAction, useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import capitalize from '@/utils/capitalize'
import { NFeData, NFeProduto, NFeResult } from '@/utils/parseXml'
import Converter from '@/utils/typeConversion'
import Search from '@/components/Search/Search'
import CheckBox from '@/app/(app)/configurar/(CheckBox)/CheckBox'

export default function DocumentoDetalhes({documento}: {documento: DocumentoImportado}) {

    const chaveFormatDisplay = useMemo(() => chaveFormatSplit(documento.chave), [documento.chave])

    return (
        <div className={style.documento}>

            <section className={style.header}>
                <span className={style.badge}>
                    {svgsUtil.produto3D}
                    {/* <h3>{documento.tipo.toUpperCase()}</h3> */}
                    <div className={style.title}>
                        <h3>{capitalize(documento.fornecedor)}</h3>
                        <span className={style.subTitle}>
                            <p>{documento.tipo.toUpperCase()}</p>
                            <p className={style.numero}>{svgsUtil.numero}{documento.numero}</p>
                        </span>
                    </div>
                </span>
            </section>

            <ul className={style.content}>

                <div className={style.detalhe}>
                    <span className={style.title}>
                        {svgsUtil.chave}
                        <p>Chave</p>
                    </span>
                    <div className={style.format}>
                        {chaveFormatDisplay?.map( (segment, index) => 
                            // <Highlight key={parseInt(segment)+index}>{segment}</Highlight>
                            <p key={parseInt(segment)+index}>{segment}</p>
                        )}
                    </div>
                </div>

                {/* <div className={style.detalhe}>
                    <span className={style.title}>
                        {svgsUtil.fornecedor}
                        <p>fornecedor</p>
                    </span>
                    <div className={style.format}>
                        {documento.fornecedor}
                    </div>
                </div> */}

                {(documento.tipo === 'cte')&&
                <CTeDados documento={documento} />
                }

                {documento.tipo === 'nfe'&&
                <NFeDados documento={documento}/>
                }

            </ul>
        </div>
    )

}

function CTeDados({ documento }: {documento: DocumentoImportado}) {

    const [display, setDisplay] = useState(false)
    const handleTabClick = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {

        e.stopPropagation()
        setDisplay( prev => !prev )

    }

    return (
        <>
        <button className={style.tag} onClick={(e) => handleTabClick(e)}>
            <h5>Dados</h5>
            {svgsUtil.expand(display)}
        </button>

        <AnimatePresence>
        {display&&
        <motion.div 
            className={style.fatores}

            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
        >
            {Object.entries(documento.data).map(([key, value], index) => 
                <Config 
                    key={index}
                    svg={svgsUtil.base} 
                    title={capitalize(key)} 
                    description={`Valor de ${key}`} 
                    input={
                        <div className={style.dado}>
                            {(key.includes('chave')
                                ? <div className={style.chave}>
                                    {chaveFormatSplit(value)?.map( (segment, index) => 
                                    <p key={parseInt(segment)+index}>{segment}</p>)}
                                  </div>
                                : <p>{capitalize(value)}</p>
                            )}
                        </div>} 
                />
            )}
        </motion.div>
        }
        </AnimatePresence>
        </>
    )


}

const INITIAL_NFE_DISPLAY = {
    pedido: false,
    produtos: false
}
const KEY_FILTER: Partial<keyof NFeProduto>[] = ['descricao', 'codigo']
function NFeDados({ documento }: {documento: DocumentoImportado}) {

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState(false)

    const [display, setDisplay] = useState(INITIAL_NFE_DISPLAY)

    const pedidoDisplay = useMemo(() => {
        return Object.entries((documento.data as NFeResult).pedido).map(([key, value]) => [capitalize(key), capitalize(value)])
    }, [documento])

    const produtosDisplay = useMemo(() => {
        return (documento.data as NFeResult).produtos
            .filter( produto => filter ? produto.st : true )
            .filter( produto => produto.codigo.includes(search) )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filter])

    const handleTabClick = (
        e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, 
        tab: keyof typeof INITIAL_NFE_DISPLAY) => {

        e.stopPropagation()
        setDisplay((prev) => ({
            ...prev,
            [tab]: !prev[tab]
        }))

    }

    return (
        <>
        <button className={style.tag} onClick={(e) => handleTabClick(e, 'pedido')}>
            <h5>Pedido</h5>
            {svgsUtil.expand(display.pedido)}
        </button>

        <AnimatePresence>
        {display.pedido&&
        <motion.div 
            className={style.fatores}
            data-overflow={display}

            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
        >
            <div className={style.wrapper}>
            {pedidoDisplay.map(([key, value], index) => 
                <Config 
                    key={index}
                    svg={svgsUtil.base} 
                    title={key} 
                    description={`Valor de ${key}`} 
                    input={<p>{value}</p>} 
                />
            )}
            </div>
        </motion.div>
        }
        </AnimatePresence>

        <button className={style.tag} onClick={(e) => handleTabClick(e, 'produtos')}>
            <h5>Produtos</h5>
            {svgsUtil.expand(display.produtos)}
        </button>

        <AnimatePresence>
        {display.produtos&&
        <motion.div 
            className={style.fatores}
            data-overflow={display}
            layout
            layoutRoot

            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
        >
            <motion.span 
                className={style.filter}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
            >
                <div className={style.st}>
                    <p>ST</p>
                    <CheckBox 
                        checked={filter} 
                        setChecked={setFilter}
                    />
                </div>
                <Search 
                    searchParam={search} 
                    setSearchParam={setSearch} 
                    textInput
                />
            </motion.span>
            {/* <LayoutGroup>                 */}
            {(produtosDisplay.length > 0)
            ?
            produtosDisplay.map( produto => 
                <Config 
                    key={produto.codigo}
                    layout
                    svg={svgsUtil.produto} 
                    title={produto.codigo} 
                    description={produto.descricao} 
                    input={
                        <div className={style.produtoDetalhe}>
                            <NfeProduto produto={produto}/>
                        </div>
                    } 
                />
            )
            :
            <motion.div 
                className={style.empty}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <span className={style.noMatch}>
                    {svgsUtil.produto}
                    <p>Nenhum <Highlight>produto</Highlight> corresponde à pesquisa.</p>
                </span>
            </motion.div>
            }
            
            {/* </LayoutGroup> */}
        </motion.div>
        }
        </AnimatePresence>

        </>
    )

}

function NfeProduto({ produto }: {produto: NFeProduto}) {

    const nfeProdutoDisplay = useMemo(() => Object.entries(produto)
        .filter(([key, value]) => !KEY_FILTER.includes(key as keyof NFeProduto))
        .map(([key, value], index) => 
        <span 
            key={index}
        >
            <h5>{key.toUpperCase()}:</h5>
            <p data-valid={key === 'st' && value}>{
            (key === 'st')
                ? value ? svgsUtil.check : svgsUtil.delete 
                : value ? value : '0,00'
            }</p>
        </span>
    ), [produto])

    return (
        <div className={style.produtoDetalhe}>
            {nfeProdutoDisplay}
        </div>
    )

}