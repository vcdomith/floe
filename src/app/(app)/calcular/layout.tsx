'use client'
import { useEffect, useRef } from 'react'
import style from './calcularLayout.module.scss'
import TabelaSection from './TabelaSection/TabelaSection'
import { useSectionSelect } from '../(contexts)/SectionSelectContext'

export default function CalcularLayout({ children }: { children: React.ReactNode }) {

    const { mainRef } = useSectionSelect()
    const { setSection } = useSectionSelect()

    useEffect(() => {

        if(mainRef.current) {

            const listener = (e: Event) => {
                const scrollEndPosition = (e.target as HTMLElement).scrollLeft!
                if (scrollEndPosition > 0 ) {
                    setSection('Tabela')
                    return
                }
                setSection('Fatores')
            }
    
            mainRef.current?.addEventListener('scrollend', listener)
    
            return () => mainRef.current?.removeEventListener('scrollend', listener)

        }

    }, [])

    return (
        <main
            className={style.main}
            ref={mainRef}
        >
            {children}
            <TabelaSection />
        </main>
    )

}