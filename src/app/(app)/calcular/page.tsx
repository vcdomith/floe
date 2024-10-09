
import Highlight from '@/components/Highlight/Highlight'
import style from './calcular.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Link from 'next/link'

export default async function Calcular() {

    return (
        <section className={style.section}>

            <div className={style.title}>
                <h3>Calcular Preços:</h3>
                <p>Selecione um método para calcular a tabela:</p>
            </div>

            <Link href={'/calcular/chave'} prefetch>
                {svgsUtil.chaveImport}
                <p>Importar valores pelas chaves NFe e CTe</p>
            </Link>
            <Link href={'/calcular/xml'} prefetch>
                {svgsUtil.xmlImport}
                <p>Importar valores por arquivo XML da NFe e CTe</p>
            </Link>
            <Link href={'/calcular/manual'} prefetch>
                {svgsUtil.ncm}
                <p>Calcular tabela manualmente</p>
            </Link>
        </section>
    )


}