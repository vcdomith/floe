import { SetStateAction } from "react"
import CheckBox from "../(CheckBox)/CheckBox"
import { motion } from 'framer-motion'

import style from './Config.module.scss'

interface ConfigProps {

    svg: React.ReactNode
    title: string
    description: string
    diff?: boolean

    input: React.ReactNode

}

const Config = ({svg, title, description, diff, input}: ConfigProps) => {

  return (
    <motion.span 
      className={style.config}
      key={title}

      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
    >
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