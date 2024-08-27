'use client'
import { KeyboardEvent, SetStateAction, useState } from "react"
import { motion } from 'framer-motion'

import style from './CheckBox.module.scss'

interface CheckBoxProps {

    name?: string
    disabled?: boolean
    checked: boolean | undefined
    setChecked: (checked: SetStateAction<boolean>) => void

}

export default function CheckBox({ checked, setChecked, name, disabled }: CheckBoxProps) {

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {

        switch (e.key) {
            // case 'Enter':
            //     e.preventDefault()
            //     setChecked(prev => !prev)
            //     break;

            case 'ArrowRight':

                e.preventDefault()
                setChecked(true)
                
                break;
                
            case 'ArrowLeft':

                e.preventDefault()
                setChecked(false)
                    
                break;
        
            

            default:
                break;
        }

        if(e.key === 'Enter') {
            
        } 

    }

    return (
        <motion.label
            className={style.wrapper}
            data-checked={checked}
            data-disabled={disabled || false}
            layout layoutRoot
        >
            <input
                className={style.input}
                name={name}
                type='checkbox'
                onChange={() => setChecked(prev => !prev)}
                checked={checked}
                value={checked ? 'on' : 'off'}
                onKeyDown={(e) => handleKeyDown(e)}
                disabled={disabled || false}
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
        </motion.label>
    )

}