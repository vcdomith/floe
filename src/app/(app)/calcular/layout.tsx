'use client'
import style from './calcularLayout.module.scss'
import TabelaSection from './TabelaSection/TabelaSection'
import { useSectionSelect } from '../(contexts)/SectionSelectContext'
import { redirect, usePathname } from 'next/navigation'

export default function CalcularLayout({ children }: { children: React.ReactNode }) {

    const { mainRef, handleScroll } = useSectionSelect()
    const path = usePathname().split('/').at(-1)
    if (path === 'calcular') redirect('calcular/chave')

    return (
        <main
            className={style.main}
            ref={mainRef}
            onScroll={(e) => handleScroll(e)}
        >
            {children}
            <TabelaSection />
        </main>
    )

}