'use client'

import styles from './Container.module.scss'
import { AnimatePresence, motion } from 'framer-motion'

interface ContainerProps {
    children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
          { children }
      </div>
    </section>
  )
}

export default Container
