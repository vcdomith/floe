
import style from './layout.module.scss'

export default function ConfigurarLayout({ children }: {children: React.ReactNode}) {

    return (

        <>
        {children}
        <div
            className={style.layout}
            >
        </div>
        </>

    )

}