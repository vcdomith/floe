'use client'

import { FormEvent, useRef, useState } from 'react'
import { IValores } from '@/interfaces/IValores'
import Table from '@/components/Table/Table'
import Container from '@/components/Container/Container'
import styles from './page.module.css'
import './padrao.css'

export default function Home() {

  const [valor, setValor] = useState<number | ''>('')
  const [valores, setValores] = useState<IValores[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  function calcularTabela(valor: number, args: number[]): number {

    return Math.round(args.reduce((acc, curr) => acc * curr, valor))

  }

  const adicionarValor = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    // if (valor)
    // setValores([...valores, valor])

    if (valor) {
      setValores([...valores, {
        unitario: valor,
        tabela1: calcularTabela(valor, [3, 1.065, 1.01, 1.1, 1.4]),
        tabela2: Math.round(valor*1.5),
        tabela3: Math.round((calcularTabela(valor, [3, 1.065, 1.01, 1.1, 1.4]))*1.3)
      }])
      
      setValor('')
    }

    console.log(valores);
  }

  // useEffect(() => {

  //   if (valor)
  //   alert(`
  //         unit: ${valor} 
  //         t1: ${valor*3*1.65*1.1} 
  //         t2: ${valor*1.5} 
  //         t3: ${(valor*3*1.65*1.1)*1.3}`
  //         )

  //   console.log(valores)

  // }, [valores])

  return (
    <section className={styles.section}>
      <Container>
        <form
          className={styles.form} 
          onSubmit={adicionarValor}
          >
          <label htmlFor="input">Valor Unitário</label>
          <input 
            className={styles.input}
            ref={inputRef}
            type="number" 
            step={0.01}
            placeholder='Digite o valor unitário'
            value={valor}
            onChange={evento => {
              evento.target.value !== ''
                ? setValor(parseFloat(evento.target.value))
                : setValor('')
            }
          }
          />
          <button className={styles.botao}>Adicionar</button>
        </form>
        <Table valores={valores} />
      </Container>
    </ section>

  )
}
