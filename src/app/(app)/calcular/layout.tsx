'use client'
import { UIEvent, useEffect, useRef } from 'react'
import style from './calcularLayout.module.scss'
import TabelaSection from './TabelaSection/TabelaSection'
import { useSectionSelect } from '../(contexts)/SectionSelectContext'

export default function CalcularLayout({ children }: { children: React.ReactNode }) {

    const { mainRef, handleScroll } = useSectionSelect()

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