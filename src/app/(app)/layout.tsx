'use client'

import Container from "@/components/Container/Container";
import Logos from './(svg)/Logos'
import React from "react";
import { usePathname } from "next/navigation.js";

export default function AppLayout({ children }: { children: React.ReactNode}) {

    const path = usePathname()

    return (
        <Container>
            <Logo route={path}/>
            {children}
        </Container>
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

    const { SvgTabela, SvgCadastros } = Logos

    const SvgLogos: SvgLogos = {

        tabela: {
            Svg: () => <SvgTabela/>,
            Titulo: 'Calcular Tabela'
        },
        cadastros: {
            Svg: () => <SvgCadastros/>,
            Titulo: 'Conferir Cadastros'
        },
        
    }

    const { Svg, Titulo } = SvgLogos[route.slice(1,) as keyof SvgLogos]!

    return (
        <span style={{
            display: 'flex',
            gap: '1rem'
        }}>
            <Svg />
            <h2 style={{
                display: 'flex',
                alignItems: 'center',
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 600,
                width: 'min-content' 
                }}>{Titulo}</h2>
        </span>
     
    )
}