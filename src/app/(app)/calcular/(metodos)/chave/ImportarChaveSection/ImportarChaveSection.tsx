'use client'
import Link from 'next/link'
import style from './ImportarChaveSection.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import ImportCard from './ImportCard/ImportCard'
import { useChave } from '../../../context/CalcularContext'
import { UIEvent, useMemo, useState } from 'react'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import FornecedorTab from '../../../Tabs/FornecedorTab/FornecedorTab'
import PedidoTab from '../../../Tabs/PedidoTab/PedidoTab'
import { AnimatePresence, motion } from 'framer-motion'
import capitalizeInner from '@/utils/capitalize'
import { useNotification } from '@/app/(app)/(contexts)/NotificationContext'
import AvisoFatoresDiferentes from '@/components/AvisoFatoresDiferentes/AvisoFatoresDIferentes'
import Tab from '@/components/Tab/Tab'
import useDocumento from '@/hooks/useDocumento'
import { CTeData } from '@/utils/parseXml'
import MetodoSelect from '../../(MetodoSelect)/MetodoSelect'

export default function ImportarChaveSection({ tipo = 'chave'} : { tipo: 'chave' | 'xml'}) {

    const { chave: { 
        context: { 
            fornecedorContext: { fornecedorData, fornecedorDiff, rollbackFornecedor, updateFornecedorControl },
            pedidoContext: { pedidoData, pedidoDiff, rollbackPedido, updatePedidoControl },
            tabelaContext: { updateFatoresTabela }
        },
        documentosContext: { documentos },
        // documentos, 
        loading, 
        submitForm 
    }} = useChave()

    const { addNotification } = useNotification()

    // const {
    //     documentos
    // } = useDocumento()

    // const {
    //     nfe: { importado: nfeImportado }, 
    //     cte: { importado: cteImportado },
    // } = documentos

    // const valid = useMemo(() => {
    //     return (nfeImportado !== undefined && cteImportado !== undefined)
    // }, [nfeImportado, cteImportado])
    const generateValid = useMemo(() => {

        const documentosValid = (documentos.cte !== null && documentos.nfe !== null)
        const chavesValid = ((documentos.cte?.data as CTeData)?.chaveNFe === documentos.nfe?.chave)
        return (documentosValid && chavesValid)

    }, [documentos])

    return (

        <section className={style.chaveSection}>
            
            <MetodoSelect />

            {/* <div className={style.title}>

                <span className={style.header}>
                    <Link href={'/calcular'} prefetch>
                        {svgsUtil.back}
                    </Link>
                    <h3>Importar NFe e CTe - {tipo}</h3>
                </span>


            </div> */}

            <div 
                className={style.content}
            >    

                <Tab 
                    svg={svgsUtil.chave} 
                    section={'Importar'} 
                    initialDisplay
                >
                    <span className={style.header}>
                        {svgsUtil.documentImport}
                        <p>Arraste um documento XML ou utilize a chave para importar dados:</p>
                    </span>
                    
                    {/* <Xml documento={documentos.cte} /> */}
                    <ImportCard />
                    {/* <Chave documento={documentos.cte}/> */}
                    
                    {/* Aviso caso tenha algum: 
                        ° Chave NFe não é compatível com a CTe: chaveNFe cte
                        ° 
                     */}

                    {/* <button
                        className={style.submit} 
                        onClick={() => submitForm()}
                        disabled={(!generateValid || loading)}
                    >
                        {(loading)
                            ? <><LogoSvg loop />  Importando...</>
                            : 'Gerar Tabela'
                        }
                    </button> */}

                    {/* <ImportCard 
                        tipo={tipo} 
                        documento={documentos.cte}     
                    />
                    
                    <ImportCard
                        tipo={tipo} 
                        documento={documentos.nfe}
                    /> */}
                </Tab>

                <Tab 
                    svg={svgsUtil.unitarioNota} 
                    section={'Fatores'}
                >

                    <FornecedorTab 
                        disabled
                        fornecedorCtx={fornecedorData.nome} 
                        fornecedores={[]} 
                    />
                    <AnimatePresence>
                    {(fornecedorDiff.length > 0) &&
                    <AvisoFatoresDiferentes 
                        tab={'fornecedor'} 
                        cancelHandler={rollbackFornecedor} 
                        confirmHandler={() => {
                            updateFornecedorControl(fornecedorData)
                            updateFatoresTabela()
                            addNotification({
                                tipo: 'sucesso',
                                mensagem: 'Fatores atualizados com sucesso!'
                            })
                        }} 
                    />

                    }
                    </AnimatePresence>

                    <PedidoTab />
                    <AnimatePresence>
                    {(pedidoDiff.length > 0) &&
                    <AvisoFatoresDiferentes 
                        tab={'pedido'} 
                        cancelHandler={rollbackPedido} 
                        confirmHandler={() => {
                            updatePedidoControl(pedidoData)
                            updateFatoresTabela()
                            addNotification({
                                tipo: 'sucesso',
                                mensagem: 'Fatores atualizados com sucesso!'
                            })
                        }} 
                    />

                    }
                    </AnimatePresence>
                </Tab>

            </div>

            <button
                className={style.submit} 
                onClick={() => submitForm()}
                disabled={(!generateValid || loading)}
            >
                {(loading)
                    ? <><LogoSvg loop />  Importando...</>
                    : 'Gerar Tabela'
                }
            </button>

        </section>

    )

}