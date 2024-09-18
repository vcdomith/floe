import style from './DetalheSection.module.scss'

export default function DetalheSection({ children }: { children: React.ReactNode }) {

    return (
        <section className={style.detalhe}>
            <div className={style.content}>
                {(children !== null)
                ? children
                : <div>Nenhum fornecedor selecionado</div>
                }
            </div>
        </section>
    )

}