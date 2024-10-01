'use client'
import Link from 'next/link'
import style from './ImportarChaveSection.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import { ChangeEvent, KeyboardEvent, MouseEvent, useMemo, useRef, useState } from 'react'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import Highlight from '@/components/Highlight/Highlight'
import { m } from 'framer-motion'
import ImportCard from './ImportCard/ImportCard'
import { useNotification } from '@/app/(app)/(contexts)/NotificationContext'
import { NextResponse } from 'next/server'
import { useImportarChave } from '../context/ImportChaveContext'

export default function ImportarChaveSection() {

    const { 

        chaveNFe,
        setChaveNFe, 
        NFeLoading, 
        importNFe,
        NFeImportado,
        
        chaveCTe, 
        setChaveCTe, 
        CTeLoading,
        importCTe, 
        CTeImportado,

    } = useImportarChave()


    return (

        <section className={style.chaveSection}>
            
            <div className={style.title}>
                <span className={style.header}>
                    <Link href={'/calcular'}>
                        {svgsUtil.back}
                    </Link>
                    <h3>Importar NFe e CTe</h3>
                </span>
                <p>Forneça a chave de acesso da Nfe com 44 dígitos para importar os valores da nota:</p>

            </div>

            <div className={style.content}>    

            
                <ImportCard 
                    document={'CTe'} 
                    value={chaveCTe} 
                    setValue={setChaveCTe} 
                    submitAction={() => importCTe(chaveCTe)}
                    loading={CTeLoading}
                    imported={CTeImportado}
                />
                
                <ImportCard 
                    document={'NFe'} 
                    value={chaveNFe} 
                    setValue={setChaveNFe} 
                    submitAction={() => importNFe(chaveNFe)}
                    loading={NFeLoading}
                    imported={NFeImportado}
                />
                
                {/* <ImportCard 
                    document={'NFe'} 
                    value={chaveNFe} 
                    setValue={setChaveNFe} 
                    submitAction={() => importNFe(chaveNFe)}
                    loading={NFeLoading}
                /> */}

            </div>

            <button>Gerar Tabela!</button>

        </section>

    )

}