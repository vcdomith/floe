'use client'
import { useState } from "react"
import { motion } from 'framer-motion'

import style from './CheckBox.module.scss'

export default function CheckBox() {

    const [checked, setChecked] = useState(false)

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30
      };

    return (
        <label
            className={style.wrapper}
            data-checked={checked}
        >
            <input
                onChange={() => setChecked(prev => !prev)}
                checked={checked}
                type='checkbox'
                className={style.input}
            >   
            </input>
            <motion.div 
                //framer-motion
                layout 
                transition={spring}

                className={style.slider}
                aria-hidden='true'
                data-checked={checked}
            >
            </motion.div>
        </label>
    )

}