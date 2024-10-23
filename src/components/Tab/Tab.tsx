import { MouseEvent, useState } from "react"
import { svgsUtil } from "../SvgArray/SvgUtil"

import style from './Tab.module.scss'
import { AnimatePresence, motion } from "framer-motion"

interface Tab {
    svg: React.ReactNode
    section: string
    children: React.ReactNode
    initialDisplay?: boolean
}

export default function Tab({ svg, section, initialDisplay = false ,children }: Tab) {

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
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
            >
                <section className={style.section}>
                    {children}
                </section>
            </motion.section>
        }
        </AnimatePresence>

        </>
    )

}