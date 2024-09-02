import { SetStateAction } from "react"
import CheckBox from "../(CheckBox)/CheckBox"
import { motion } from 'framer-motion'

import style from './Config.module.scss'

interface ConfigProps {

    subConfig?: boolean
    svg: React.ReactNode
    title: string
    description: string
    diff?: boolean

    input: React.ReactNode

}

const Config = ({subConfig, svg, title, description, diff, input}: ConfigProps) => {

  return (
    <motion.span 
      className={style.config}
      data-subConfig={subConfig}
      key={title}

      // layout
      // layoutRoot
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
    >
        {subConfig&&
            <div className={style.subConfig}>
                <div className={style.icon}></div>
                <div></div>
            </div>
        }
        <span className={style.info}>
            {svg}
            <div className={style.texts}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div 
              className={style.diffIcon}
              data-diff={diff}
            ></div>           
        </span>
        {input}
    </motion.span>
  )

}

export default Config