import { motion } from 'framer-motion'

import style from './Config.module.scss'
import { forwardRef } from 'react'

interface ConfigProps {

    layout?: boolean

    subConfig?: boolean
    className?: string
    svg: React.ReactNode
    title: string
    description: string
    diff?: boolean

    input: React.ReactNode

}
const Config = forwardRef<HTMLSpanElement, ConfigProps>(function Config({ className, subConfig, svg, title, description, diff, input, layout = false}: ConfigProps, ref) {
// const Config = ({ className, subConfig, svg, title, description, diff, input, layout = false}: ConfigProps) => {

  return (
    <motion.span 
      className={`${style.config} ${className}`}
      data-subconfig={subConfig}
      key={title}
      ref={ref}

      layout={layout&& 'position'}
      layoutScroll={layout}
      // layoutRoot
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={
        layout 
        ? { duration: 0.3 }
        : { type: 'spring', bounce: 0, restDelta: 0.5 }
      }
        
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

})

export default Config