'use client'
import Link from "next/link";
import style from './MetodoSelect.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import { redirect, usePathname } from "next/navigation";
import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useDynamicState from "@/hooks/useDynamicState";
import { useRouter } from "next/navigation";
import capitalize from "@/utils/capitalize";

const METODOS = ['chave', 'manual']
// const IDS = METODOS.length

export default function MetodoSelect() {

    const path = usePathname().split('/').at(-1)
    // console.log(path);

    // const router = useRouter()
    // const [metodo, setMetodo] = useState(path?? 'chave')

    // if (metodo !== path) router.push(metodo)

    const [open, setOpen] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)

    console.log(containerRef.current?.children);

    useEffect(() => {

        function handleClickOutside(e: MouseEvent) {
            if( containerRef.current && !containerRef.current?.contains(e.target as Node) ) {
                setOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        } 

    }, [])

    // const spring = { 
    //     type: "spring",
    //     mass: 0.5,
    //     damping: 11, 
    //     bounce: 0, 
    //     restDelta: 0.5,
    // }

    return (
        // <SelectFornecedor 
        //     fornecedoresControle={['chave', 'manual']} 
        //     fornecedor={path?? ''} 
        //     setFornecedor={setMetodo} 
        // />

        <div 
            className={style.container}
            ref={containerRef}
        >
            <button 
                className={style.metodo}
                data-open={open}
                onClick={() => setOpen( prev => !prev )}
            >
                <h2>{capitalize(path?? '')}</h2>
                {svgsUtil.expand(open)}
            </button>
            <AnimatePresence>
            {open&&
                <motion.ul 
                    className={style.list}

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {METODOS.map(metodo => 
                        <Link
                            key={metodo}
                            href={metodo}
                            prefetch
                            data-selected={path === metodo}
                        >
                            <p>{capitalize(metodo)}</p>
                            {path === metodo&&
                            svgsUtil.sucesso
                            }
                        </Link>
                    )}
                </motion.ul>
            }
            </AnimatePresence>
        </div>

        // <span className={style.select}>
        
        //     <div className={style.option}>
        //         <Link
        //             href={'/calcular/chave'}
        //             prefetch
        //             data-selected={path === 'chave'}
        //         >
        //             {svgsUtil.documentImport}
        //             <p>importar</p>
        //         </Link>
        //         {path === 'chave'&&
        //         <motion.div 
        //             className={style.background}
        //             layoutId="Metodo"
        //             transition={spring}
        //         ></motion.div>
        //         }
        //     </div>
        //     <div className={style.option}>
        //         <Link
        //             href={'/calcular/manual'}
        //             prefetch
        //             data-selected={path === 'manual'}
        //         >
        //             {svgsUtil.unitarioNota}
        //             <p>manual</p>
        //         </Link>
        //         {path === 'manual'&&
        //         <motion.div 
        //             className={style.background}
        //             layoutId="Metodo"
        //             transition={spring}
        //         ></motion.div>
        //         }
        //     </div>
        // </span>
    )

}