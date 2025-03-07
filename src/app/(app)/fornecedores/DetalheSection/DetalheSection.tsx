'use client'
import React from 'react';
import style from './DetalheSection.module.scss'
import { usePathname } from 'next/navigation';

export default function DetalheSection({ children }: { children: React.ReactNode }) {

    // const handleClick = () => {
    //     const phoneNumber = '553288088692';
    //     const message = 'Hello, this is a template message!';
    //     const encodedMessage = encodeURIComponent(message);
    //     const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    //     window.open(whatsappLink);
    // }

    const path = usePathname().slice(1,).split('/')[1]?.replaceAll('%20', ' ')

    return (
        <section 
            className={style.detalhe}
            data-invisible={path === undefined}
        >
            <div className={style.content}>
                {(children !== null)
                ? children
                : <div>Nenhum fornecedor selecionado</div>
                }
            </div>
        </section>
    )

}