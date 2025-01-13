import style from './DetalheSection.module.scss'

export default function DetalheSection({ children }: { children: React.ReactNode }) {

    // const handleClick = () => {
    //     const phoneNumber = '553288088692';
    //     const message = 'Hello, this is a template message!';
    //     const encodedMessage = encodeURIComponent(message);
    //     const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    //     window.open(whatsappLink);
    // }

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