import { MouseEvent, useState } from "react"
import { svgsUtil } from "../SvgArray/SvgUtil"

import style from './Tab.module.scss'
import { AnimatePresence, motion } from "framer-motion"

interface Tab {
    svg: React.ReactNode
    section: string
    initialDisplay?: boolean
    heightMode?: 'auto' | '100%'
    children: React.ReactNode
}

export default function Tab({ svg, section, initialDisplay = false, heightMode = 'auto', children }: Tab) {

    const [display, setDisplay] = useState(initialDisplay)

    const handleTabClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setDisplay( prev => !prev )
    }

    return (
        <>

        <button
            className={style.tab}
            onClick={(e) => handleTabClick(e) }
            data-active={display}
        >
            {svg}
            <p>{section}</p>
            {svgsUtil.expand(display)}
        </button>

        <AnimatePresence initial={!initialDisplay}>
        {display&&
            <motion.section
                className={style.wrapper}
                
                initial={{ height: 0 }}
                animate={{ height: heightMode === '100%' 
                    ? `calc(${heightMode} - 1rem)` 
                    : heightMode }}
                exit={{ height: 0 }}
                transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
            >
                <section 
                    className={style.section}
                    data-height={heightMode}
                >
                    {children}
                </section>
            </motion.section>
        }
        </AnimatePresence>

        </>
    )

}