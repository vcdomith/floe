'use client'
import Link from 'next/link'
import style from './FornecedoresSection.module.scss'
import capitalize from '@/utils/capitalize'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Search from '@/components/Search/Search'
import { usePathname } from 'next/navigation'

interface FatoresSectionProps {

    fornecedores: { id: number, nome: string | null }[] | undefined
    path: string[]

}

export default function FornecedoresSection({ fornecedores, path } : FatoresSectionProps) {

    const selectedPath = (path !== undefined) ? path[0] : undefined

    return (
        <section className={style.fornecedores}>

            <header className={style.header}>

                <div className={style.title}>
                    <h3>Fornecedores</h3>
                    <p>
                        Selecione um fornecedor para conferir suas fatores e configurações:
                    </p>
                </div>

                <button className={style.novo}>
                    + Novo Fornecedor
                </button>

                <input type="text" placeholder='buscar' />

            </header>
            {/* <Search 
                className={style.search} 
                searchParam={searchParam} 
                setSearchParam={setSearchParam} 
                textInput={(searchField.toLowerCase() === 'codigo')}
            /> */}

            <div className={style.content}>

                <div className={style.fornecedoresContainer}>
                {
                fornecedores&&
                (fornecedores.map( fornecedor => 
                    <Link 
                        className={style.fornecedor}
                        data-selected={selectedPath === fornecedor.nome}
                        key={fornecedor.id} 
                        href={`/fornecedores/${fornecedor.nome}`} 
                        prefetch
                    >
                        {svgsUtil.transporte}
                        <p>{fornecedor.id}</p>
                        <p>{fornecedor.nome&& capitalize(fornecedor.nome)}</p>
                    </Link>
                ))
                }
                </div>
            </div>
        </section>
    )

}