'use client'
import Link from "next/link";
import style from './MetodoSelect.module.scss'
import { motion } from 'framer-motion'
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import { usePathname } from "next/navigation";

export default function MetodoSelect() {

    const path = usePathname().split('/').at(-1)
    // console.log(path);

    const spring = { 
        type: "spring",
        mass: 0.5,
        damping: 11, 
        bounce: 0, 
        restDelta: 0.5,
    }

    return (
        <span className={style.select}>
            <div className={style.option}>
                <Link
                    href={'/calcular/chave'}
                    prefetch
                    data-selected={path === 'chave'}
                >
                    {svgsUtil.documentImport}
                    <p>importar</p>
                </Link>
                {path === 'chave'&&
                <motion.div 
                    className={style.background}
                    layoutId="Metodo"
                    transition={spring}
                ></motion.div>
                }
            </div>
            <div className={style.option}>
                <Link
                    href={'/calcular/manual'}
                    prefetch
                    data-selected={path === 'manual'}
                >
                    {svgsUtil.unitarioNota}
                    <p>manual</p>
                </Link>
                {path === 'manual'&&
                <motion.div 
                    className={style.background}
                    layoutId="Metodo"
                    transition={spring}
                ></motion.div>
                }
            </div>
        </span>
    )

}