import LogoSvg from "@/components/SvgArray/LogoSvg"
import Link from "next/link"

import style from './Nav.module.scss'
import SvgArray from "@/components/SvgArray/SvgArray"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const Nav = ({ pathname }: { pathname: string}) => {

    const [display, setDisplay] = useState(false)

  return (
    <>
    <AnimatePresence>
            { display&&
            <motion.div
                initial={{opacity: 0, width: '4rem'}}
                animate={{opacity: 1, width: '10rem'}}
                exit={{opacity: 0, width: '4rem'}}
                // transition={{ duration: 0.3 }}

                className={style.background}
                // style={{ width: `${display ? '10rem' : '4rem'}`}}
            >
                <SvgArray className={'a'} interval={2000} />
            </motion.div>
            } 
        </AnimatePresence>
    <nav className={style.nav}
        onMouseEnter={() => setDisplay(true)}
        onMouseLeave={() => setDisplay(false)}
    >       
        
            <span>
                <LogoSvg />
                <h2>floe</h2>
            </span>
            <div className={style.links}>
            <Link href='/configurar' prefetch>
                        <button className={`${(pathname === '/configurar' ? style.active : '')}`}>
                            <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="250" cy="247" r="125" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M0.5 271C97.5 271 61.8621 20.9999 205 21C258.5 21 250 70 250 129" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M499.994 230C402.994 230 438.632 480 295.494 480C241.994 480 250.494 431 250.494 372" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M249.969 140C249.969 177 214 187.5 214 225.5C214 269.434 296.165 223.104 298 267C299.317 298.507 249.969 315 249.969 355.448" stroke="white" strokeWidth="40"/>
                            </svg>
                            <p>Configurar Fatores</p>
                        </button>
                    </Link>
                    <Link href='/tabela' prefetch>
                        <button className={`${(pathname === '/tabela' ? style.active : '')}`}>
                        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="144" cy="255.844" r="69" stroke="#E8D4B0" stroke-width="40"/>
                            <path d="M148 168C148 131.5 123.141 103.729 148 80C171.729 57.3496 197.5 80 232 80" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                            <path d="M148 344C148 368 128.493 397.152 148 419C169.848 443.47 206 419 232 419" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                            <path d="M84.5 257.5H0" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                            <path d="M500 80.0012C477.075 79.8807 466 125.704 422 125.5C378 125.296 358 31 315 31C275 31 251.458 79.5102 232 80.0012" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                            <path d="M500 419.001C477.075 418.881 466 464.704 422 464.5C378 464.296 358 370 315 370C275 370 251.458 418.51 232 419.001" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                            <path d="M500 259.001C477.075 258.881 466 304.704 422 304.5C378 304.296 358 210 315 210C275 210 251.458 258.51 232 259.001" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                        </svg>
                            <p>Calcular Tabela</p>
                        </button>
                    </Link>
                    <Link href='/cadastros' prefetch>
                        <button className={`${(pathname === '/cadastros' ? style.active : '')}`}>
                        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 480.001C249.5 480.001 0 359 249.5 359" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 480.001C499.5 480.001 250 359 499.5 359" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M0 141C249.5 141 0 20 249.5 20" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 141C499.5 141 250 20 499.5 20" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M0 302C249.5 302 0 181 249.5 181" stroke="#591C4A" strokeWidth="40"/>
                            <path d="M250 319.5C499.5 319.5 250 181 499.5 181" stroke="#591C4A" strokeWidth="40"/>
                            <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
                        </svg>
                            <p>Conferir Cadastros</p>
                        </button>
                    </Link>
            </div>
        </nav>
        </>
  )
}

export default Nav