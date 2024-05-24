'use client'

import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import capitalize from "@/utils/capitalize";
import { useState } from "react";

import style from './FornecedorTab.module.scss'
import { motion, AnimatePresence } from "framer-motion";

interface FornecedorTabProps {

    fornecedores: string[]
    svg?: React.ReactNode
    titulo?: string

}

export default function FornecedorTab({ fornecedores, svg, titulo }: FornecedorTabProps) {

    const [fornecedor, setFornecedor] = useState('')
    const setCapitalizedFornecedor = (value: string) => {
        setFornecedor(capitalize(value))
    }
    const [loading, setLoading] = useState(false)
    const [display, setDisplay] = useState(false)

    return (
        <div className={style.wrap} data-display={display}>
        <span className={style.fornecedorTab} data-display={display}>
            <span className={style.title}>
                {svg
                ?
                svg
                :
                <SvgFornecedor />
                }
                <h3>{ titulo ? titulo : 'Fornecedor'}</h3>
            </span>
            <SelectFornecedor 
                loading={loading}
                fornecedoresControle={fornecedores}
                fornecedor={fornecedor}
                setFornecedor={setCapitalizedFornecedor}
            />
            {/* {(fornecedor !== '')&&} */}
            <button className={style.button} onClick={() => setDisplay(prev => !prev)}>
                <svg fill="#000000" width="25px"viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d={`${display 
                                ? "M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"
                                : "M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"
                            }`}
                        />
                </svg>
                {/* <svg width="25" height="25" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M357 136L471 249.5L357 363" stroke="black" stroke-width="40"/>
                <path d="M0 248.697C113.5 248.697 38.5 88.5 134.5 88.5C230.5 88.5 109.5 404 204.5 404C299.5 404 203.5 248.697 372 248.697H450.5" stroke="black" stroke-width="40"/>
                </svg>
                <svg fill="#000000" width="25" height="25" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"/></svg> */}
            </button>
        </span>
        <AnimatePresence mode="wait">
            {display&&
            <motion.div className={style.list}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
            >
            <ul>
                {fornecedores.map( fornecedor => 
                    <li key={fornecedor}>
                        {fornecedor}
                    </li>
                )}
            </ul>
            </motion.div>
            }
        </AnimatePresence>
        </div>
    )

}

const SvgFornecedor = () => {
    return (
        <svg className={style.svgFornecedor} width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M463 437.5C426.388 437.619 412.769 374.8 342.5 375C272.231 375.201 266.172 437.5 197.5 437.5C133.619 437.5 68.0749 387.76 37 387.277" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M463 342.5C426.388 342.619 412.769 279.8 342.5 280C272.231 280.201 266.172 342.5 197.5 342.5C133.619 342.5 68.0749 292.76 37 292.277" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M169 144L50.5 181.5C101.414 241.835 195.827 310.885 236.5 322.284L328.5 279C395 264.5 411.5 183.5 444 134.5L169 144Z" fill="none" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="bevel"/>
            <path d="M271 142V99.4808M271 99.4808V43L202 70.9231L271 99.4808Z" stroke="#E8D4B0" strokeWidth="40"/>
        </svg>
    )
}