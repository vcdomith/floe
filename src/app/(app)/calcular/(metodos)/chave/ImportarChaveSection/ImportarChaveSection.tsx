'use client'
import Link from 'next/link'
import style from './ImportarChaveSection.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import ImportCard from './ImportCard/ImportCard'
import { useChave } from '../../../context/CalcularContext'

export default function ImportarChaveSection() {

    const { chave: { documentos }, cadastrarPedido } = useChave()

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

            <button>Gerar Tabela!</button>

        </section>

    )

}