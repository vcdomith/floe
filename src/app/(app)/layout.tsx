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
import CalcularContextWrapper from "./calcular/CalcularContextWrapper/CalcularContextWrapper";
import { CalcularProvider } from "./calcular/context/CalcularContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {

    const path = usePathname()

    const MainLogo = Logos.SvgTabela

    return (
        <NotificationProvider>
        <CalcularProvider>
            <Nav pathname={path} />
        {/* <header className={style.header}>
            <div>
                <MainLogo /> 
                <LogoSvg /> 
                <h2>floe</h2>
            </div>
            <span>
            <Link href='/configurar' prefetch>
                        <button>
                            <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="250" cy="247" r="125" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M0.5 271C97.5 271 61.8621 20.9999 205 21C258.5 21 250 70 250 129" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M499.994 230C402.994 230 438.632 480 295.494 480C241.994 480 250.494 431 250.494 372" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M249.969 140C249.969 177 214 187.5 214 225.5C214 269.434 296.165 223.104 298 267C299.317 298.507 249.969 315 249.969 355.448" stroke="white" strokeWidth="40"/>
                            </svg>
                            Configurar Fatores
                        </button>
                    </Link>
                    <Link href='/tabela' prefetch>
                        <button>
                        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 150.278 180.487 198.278 211.82" stroke="#591C4A" strokeWidth="40"/>
                        <path d="M474.07 98.893C465.57 92.393 350.07 7.89299 305.57 43.893C261.07 79.893 498.57 212.393 474.07 298.893C454.47 368.093 353.57 322.726 305.57 291.393" stroke="#591C4A" strokeWidth="40"/>
                        <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
                        </svg>
                            Calcular Tabela
                        </button>
                    </Link>
                    <Link href='/cadastros' prefetch>
                        <button>
                         <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 480C137.5 480 124 359 249.5 359" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M0 301C137.5 301 124 180 249.5 180" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 480C387.5 480 374 359 499.5 359" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 319C387.5 319 374 198 499.5 198" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 141.5C387.5 141.5 374 20 499.5 20" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M0 141.5C137.5 141.5 124 20 249.5 20" stroke="#591C4A" strokeWidth="40"/>
                            <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
                        </svg> 
                        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 480.001C249.5 480.001 0 359 249.5 359" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 480.001C499.5 480.001 250 359 499.5 359" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M0 141C249.5 141 0 20 249.5 20" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 141C499.5 141 250 20 499.5 20" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M0 302C249.5 302 0 181 249.5 181" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 319.5C499.5 319.5 250 181 499.5 181" stroke="#591C4A" strokeWidth="40"/>
                            <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
                        </svg>
                            Conferir Cadastros
                        </button>
                    </Link>
            </span>
        </header> */}
        <Container>
            <Logo route={path}/>
            {children}
            <Notifications />
        </Container>
        </CalcularProvider>
        </NotificationProvider>
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