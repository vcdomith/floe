
import style from './calcularLayout.module.scss'
import TabelaSection from './TabelaSection/TabelaSection'

export default function CalcularLayout({ children }: { children: React.ReactNode }) {

    return (
        <main
            className={style.main}
        >
            {children}
            <TabelaSection />
        </main>
    )

}