'use client'
import Link from 'next/link'
import style from './ImportarChaveSection.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import ImportCard from './ImportCard/ImportCard'
import { useChave } from '../../../context/CalcularContext'
import { useMemo } from 'react'
import LogoSvg from '@/components/SvgArray/LogoSvg'

export default function ImportarChaveSection() {

    const { chave: { documentos, loading, submitForm } } = useChave()

    const {
        nfe: { importado: nfeImportado }, 
        cte: { importado: cteImportado },
    } = documentos

    const valid = useMemo(() => {
        return (nfeImportado !== undefined && cteImportado !== undefined)
    }, [nfeImportado, cteImportado])

    return (

        <section className={style.chaveSection}>
            
            <div className={style.title}>

                <span className={style.header}>
                    <Link href={'/calcular'} prefetch>
                        {svgsUtil.back}
                    </Link>
                    <h3>Importar NFe e CTe</h3>
                </span>

                <p>Forneça a chave de acesso da Nfe com 44 dígitos para importar os valores da nota:</p>

            </div>

            <div className={style.content}>    

                <ImportCard 
                    documento={documentos.cte}     
                />
                
                <ImportCard 
                    documento={documentos.nfe}
                />

            </div>

            <button
                className={style.submit} 
                onClick={() => submitForm()}
                disabled={(!valid || loading)}
            >
                {(loading)
                    ? <><LogoSvg loop />  Importando...</>
                    : 'Gerar Tabela!'
                }
            </button>

        </section>

    )

}