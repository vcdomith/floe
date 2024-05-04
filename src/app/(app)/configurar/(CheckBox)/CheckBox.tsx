'use client'
import { useState } from "react"
import { motion } from 'framer-motion'

export default function CheckBox() {

    const [checked, setChecked] = useState(false)

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30
      };

    return (
        <div
            onClick={() => setChecked(prev => !prev)}
            style={{
                width: '35px',
                height: '20px',
                outline: 'none',
                // backgroundColor: `${checked ? 'white' : ''}`,
                borderRadius: '2rem',
                display: 'flex',
                justifyContent: `${checked ? 'flex-end' : 'flex-start'}`,
                alignItems: 'center',
                padding: '0 0.25rem',
                border: '2px solid',
                cursor: 'pointer',
            }}
        >
            <motion.div layout transition={spring}
                style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: `${checked ? 'purple' : ''}`,
                    // backgroundColor: 'wheat',
                    border: '2px solid',
                    // borderColor: `${checked ? 'wheat' : '' }`,
                    borderRadius: '15px',
                    transition: 'background-color 200ms ease'
                }}
            >
                
            </motion.div>
            {/* <motion.svg width="25" height="25" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" layout>
                <circle cx="250" cy="250" r="100" stroke="#591C4A" strokeWidth="40" 
                style={{ fill: `${checked ? 'purple' : 'transparent'}` }}
                />
            </motion.svg> */}
        </div>
    )

}