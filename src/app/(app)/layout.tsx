'use client'

import Container from "@/components/Container/Container";
import Logos from './(svg)/Logos'
import React from "react";
import { usePathname } from "next/navigation.js";

import style from './style.module.scss'
import Link from "next/link";
import { NotificationContext, NotificationProvider, useNotification } from "./(contexts)/NotificationContext";
import Notifications from "./(Notifications)/Notifications";
import LogoSvg from "@/components/SvgArray/LogoSvg";
import Nav from "./(nav)/Nav";
import { CalcularProvider } from "./calcular/context/CalcularContext";
import { ModalProvider } from "./(contexts)/ModalContext";
import Modal from "./(Modal)/Modal";
import SectionSelect from "./(SectionSelect)/SectionSelect";
import GlobalProvider from "./(contexts)/GlobalProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {


    return (
        <GlobalProvider>
            <Nav />
            <SectionSelect />
            <Container>
                {/* <Logo route={path}/> */}
                {children}
                <Notifications />
                <Modal />
            </Container>
        </GlobalProvider>
    )

}

const Logo = ({ route }: { route: string }): React.ReactNode => {

    interface Logo {

        Svg: () => React.ReactNode
        Titulo: string
        
    }

    interface SvgLogos {

        configurar?: Logo
        tabela: Logo
        calcular: Logo
        cadastros: Logo

    }

    const { SvgConfigurar, SvgTabela, SvgCadastros } = Logos

    const SvgLogos: SvgLogos = {
        
        configurar: {
            Svg: () => <SvgConfigurar />,
            Titulo: 'Configurar Fatores',
        },
        tabela: {
            Svg: () => <SvgTabela/>,
            Titulo: 'Calcular Tabela'
        },
        calcular: {
            Svg: () => <SvgTabela/>,
            Titulo: 'Calcular Tabela'
        },
        cadastros: {
            Svg: () => <SvgCadastros/>,
            Titulo: 'Conferir Cadastros'
        },
        
    }

    // const { Svg, Titulo } = SvgLogos[route.slice(1,) as keyof SvgLogos]!
    const { Svg, Titulo } = Object.values(SvgLogos).includes(route.slice(1)) 
        ? SvgLogos[route.slice(1,) as keyof SvgLogos]!
        : SvgLogos['tabela']
    // SvgLogos[route.slice(1,) as keyof SvgLogos]!

    return (
        <span 
            className={style.logo}
        >
            <Svg />
            <h2>{Titulo}</h2>
        </span>
     
    )
}