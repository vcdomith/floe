import Container from "@/components/Container/Container"
import TableBody from "@/components/Table/TableBody/TableBody"
import { ICadastro } from "@/interfaces/ICadastro"
import { IProduto } from "@/interfaces/IProduto"
import { dbConnect } from "@/utils/db/supabase"
import { createClient } from "@supabase/supabase-js"
import { useState } from "react"
import Cadastro from "./Cadastro/Cadastro"
import { motion } from 'framer-motion'

import style from './Cadastros.module.scss'
import Link from "next/link"

//Exportando 'revalidate' com valor 0, desse componente, a API do supabase sabe que deve revalidar os dados a cada refresh assim como um getServerSideProps
export const revalidate = 0

export default async function Cadastros() {
    
    const supabase = dbConnect()
    const {data: cadastros} = await supabase.from('cadastros').select()

    return (
    <>
        <div 
        style={{
            backgroundColor: '#e8d4b0',
            width: '100%'
        }}>
            <div>
                <span
                    style={{
                        display: 'flex',
                        padding: '1rem',
                        gap: '2rem',
                        // borderRadius: '1rem',
                        // border: '2px solid'
                    }}
                >
                    <div>Id</div>
                    <div>Criado em:</div>
                    <div>Fornecedor</div>
                    <div>Produtos</div>
                </span>
            </div>
            <div
                className={style.container}
                style={{
                    width: '80%'
                }}
            >
            {cadastros?.map( (cadastro: ICadastro) => 
                <Cadastro key={cadastro.id} cadastro={cadastro}/>
            )}
            </div>
        </div>
    </>
    )

}
