'use client'

import styles from './Container.module.scss'

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