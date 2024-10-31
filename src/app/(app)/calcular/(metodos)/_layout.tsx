import MetodoSelect from "./(MetodoSelect)/MetodoSelect";
import style from './metodos.module.scss'

export default function MetodosLayout({children}: { children: React.ReactNode }) {

    return (
        <section className={style.section}>
            <MetodoSelect />
            {children}
        </section>
    )

}