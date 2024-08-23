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
                <SvgArray className={'a'} />
            </motion.div>
            } 
        </AnimatePresence>
    <nav 
        className={style.nav}
        data-display={display}
        onMouseEnter={() => setDisplay(true)}
        onMouseLeave={() => setDisplay(false)}
    >       
        
            <span className={style.logo}>
                <LogoSvg />
                <h2>floe</h2>
            </span>
            <div 
                className={style.links}
                data-display={display}
            >
                <Link href='/configurar' prefetch>
                    <button 
                    className={`${(pathname === '/configurar' ? style.active : '')}`}
                    >
                        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="355" cy="256.614" r="68" stroke="#E8D4B0" strokeWidth="40"/>
                            <path d="M271 258H0" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M500 258H441" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M69.9496 0.571302C69.9497 26.7286 115.604 30.0417 115.4 68.9252C115.197 107.809 21 126.666 21 164.663C21 200.009 69.9497 216.388 69.9496 237.391" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M241.452 262.571C241.451 288.729 195.797 292.042 196.001 330.925C196.205 369.809 290.401 388.666 290.401 426.663C290.401 462.009 241.451 478.388 241.452 499.391" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M183.95 0.571302C183.95 26.7286 229.604 30.0417 229.4 68.9252C229.197 107.809 135 126.666 135 164.663C135 200.009 183.95 216.388 183.95 237.391" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M131.452 262.571C131.451 288.729 85.7968 292.042 86.0007 330.925C86.2046 369.809 180.401 388.666 180.401 426.663C180.401 462.009 131.451 478.388 131.452 499.391" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                        </svg>
                        {(pathname === '/configurar')&&
                        <motion.div layoutId='Nav'></motion.div>
                        }
                        <p>Configurar Fatores</p>
                    </button>
                </Link>
                <Link href='/calcular' prefetch>
                    <button 
                    className={`${(pathname === '/calcular' ? style.active : '')}`}
                    >
                        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="144" cy="255.844" r="69" stroke="#E8D4B0" strokeWidth="40"/>
                            <path d="M148 168C148 131.5 123.141 103.729 148 80C171.729 57.3496 197.5 80 232 80" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M148 344C148 368 128.493 397.152 148 419C169.848 443.47 206 419 232 419" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M84.5 257.5H0" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M500 80.0012C477.075 79.8807 466 125.704 422 125.5C378 125.296 358 31 315 31C275 31 251.458 79.5102 232 80.0012" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M500 419.001C477.075 418.881 466 464.704 422 464.5C378 464.296 358 370 315 370C275 370 251.458 418.51 232 419.001" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M500 259.001C477.075 258.881 466 304.704 422 304.5C378 304.296 358 210 315 210C275 210 251.458 258.51 232 259.001" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                        </svg>
                        {(pathname === '/calcular')&&
                        <motion.div layoutId='Nav' ></motion.div>
                        }
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
                        {(pathname === '/cadastros')&&
                        <motion.div layoutId='Nav'></motion.div>
                        }
                        <p>Conferir Cadastros</p>
                    </button>
                </Link>

                    
            </div>
            <div
                className={`${style.links} ${style.extra}`}
                data-expanded={display}
                data-display={display}
            >
                <Link href='/usuario' prefetch>
                    <button className={`${(pathname === '/usuario' ? style.active : '')}`}>
                        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M319 250.138C319 287.77 288.108 318.276 250 318.276C211.892 318.276 181 287.77 181 250.138C181 212.506 211.892 182 250 182C288.108 182 319 212.506 319 250.138Z" stroke="#E8D4B0" strokeWidth="40"/>
                            <path d="M480 250C480 377.025 377.025 480 250 480C122.975 480 20 377.025 20 250C20 122.975 122.975 20 250 20C377.025 20 480 122.975 480 250Z" stroke="#E8D4B0" strokeWidth="40"/>
                            <path d="M66 389.5C101.5 285.069 72.0802 294.379 169.5 268" stroke="#E8D4B0" strokeWidth="40"/>
                            <path d="M434.5 389.5C399 285.069 428.42 294.379 331 268" stroke="#E8D4B0" strokeWidth="40"/>
                        </svg>
                        <p>Usuário Email</p>
                    </button>
                </Link>
                <Link href='/usuario' prefetch>
                    <button className={`${(pathname === '/usuario' ? style.active : '')}`}>
                        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M319 250.138C319 287.77 288.108 318.276 250 318.276C211.892 318.276 181 287.77 181 250.138C181 212.506 211.892 182 250 182C288.108 182 319 212.506 319 250.138Z" stroke="#E8D4B0" strokeWidth="40"/>
                            <path d="M33 476C68.37 303.607 71.937 311.546 169 268" stroke="#E8D4B0" strokeWidth="40"/>
                            <path d="M468 476C432.37 303.607 428.777 311.546 331 268" stroke="#E8D4B0" strokeWidth="40"/>
                            <path d="M459 52.0002C422.388 51.8816 408.769 114.701 338.5 114.5C268.231 114.299 262.172 52.0002 193.5 52.0002C129.619 52.0002 64.0749 101.74 33 102.223" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                            <path d="M459 151C422.388 150.882 408.769 213.701 338.5 213.5C268.231 213.299 262.172 151 193.5 151C129.619 151 64.0749 200.74 33 201.223" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                        </svg>
                        <p>Usuário Email</p>
                    </button>
                </Link>
            </div>
        </nav>
        </>
  )
}

export default Nav