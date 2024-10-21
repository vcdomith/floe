import { DocumentoImportado } from '@/hooks/useDocumento'
import style from './DocumentoDetalhes.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Config from '@/app/(app)/configurar/(Config)/Config'
import chaveFormatSplit from '@/utils/chaveFormat'
import Highlight from '@/components/Highlight/Highlight'
import { MouseEvent, useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import capitalize from '@/utils/capitalize'
import { NFeData, NFeProduto, NFeResult } from '@/utils/parseXml'
import Converter from '@/utils/typeConversion'
import Search from '@/components/Search/Search'

export default function DocumentoDetalhes({documento}: {documento: DocumentoImportado}) {

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
                        {chaveFormatSplit(documento.chave)?.map( (segment, index) => 
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
    const [filter, setFilter] = useState({
        st: false
    })
    const [display, setDisplay] = useState(INITIAL_NFE_DISPLAY)

    const { floatToString, stringToFloat } = Converter

    console.log(documento.data);
    const produtosDisplay = useMemo(() => {
        return (documento.data as NFeResult).produtos.filter( produto => produto.codigo.includes(search))
    }, [documento, search])

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
            {Object.entries((documento.data as NFeResult).pedido).map(([key, value], index) => 
                <Config 
                    key={index}
                    svg={svgsUtil.base} 
                    title={capitalize(key)} 
                    description={`Valor de ${key}`} 
                    input={<p>{capitalize(value)}</p>} 
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

        <LayoutGroup>
        {/* <AnimatePresence mode='popLayout'> */}
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
            <span className={style.filter}>
                <Search 
                    searchParam={search} 
                    setSearchParam={setSearch} 
                />
            </span>
            {produtosDisplay.map( produto => 
                <Config 
                    key={produto.codigo}
                    svg={svgsUtil.produto} 
                    title={produto.codigo} 
                    description={produto.descricao} 
                    input={
                        <div className={style.produtoDetalhe}>
                        {Object.entries(produto)
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
                        )}
                        </div>
                    } 
                />
            )
            }
        </motion.div>
        }
        </LayoutGroup>
        {/* </AnimatePresence> */}

        </>
    )

}