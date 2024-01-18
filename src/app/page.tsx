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

    return customRound(args.reduce((acc, atual) => acc * atual, valor))

  }

  const adicionarValor = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (valor) {
      setValores([...valores, {
        unitario: valor,
        tabela1: calcularTabela(valor, [3, 1.065, 1.01, 1.1, 1.4]),
        tabela2: customRound(valor*1.5),
        tabela3: customRound((calcularTabela(valor, [3, 1.065, 1.01, 1.1, 1.4]))*1.3)
      }])
      
      setValor('')
    }

    console.log(valores);
  }

  function customRound(value: number): number {
    const floorValue = Math.floor(value);
    const halfFloorValue = floorValue + 0.5;
    const nextFloorValue = floorValue + 1;
  
    const diffToFloor = Math.abs(value - floorValue);
    const diffToHalfFloor = Math.abs(value - halfFloorValue);
    const diffToNextFloor = Math.abs(value - nextFloorValue);

    let a = {
      value: value,
      floor: floorValue, 
      halfFloor: halfFloorValue,
      doubleFloor: nextFloorValue,
      diffToFloor: diffToFloor,
      diffToHalfFloor: diffToHalfFloor,
      diffToNextFloor: diffToNextFloor
    }
    

    console.table(a);
  
    if (diffToFloor <= diffToHalfFloor && diffToFloor <= diffToNextFloor) {
      return floorValue - 0.02;
    } else if (diffToHalfFloor <= diffToNextFloor) {
      return halfFloorValue;
    } else {
      return nextFloorValue - 0.02;
    }
  }

  function roundComercial(value: number): number {

    // Round to two decimal places
    let valorArrendondado = Math.round(value * 100) / 100;

    // Check the remainder when dividing by 1
    let resto = valorArrendondado % 1;

    // Define the possible rounding values
    let valoresDesejados = [0.50, 0.98];

    // Find the closest rounding value
    let valorProximo = valoresDesejados.reduce((closest, current) => {
        return Math.abs(resto - current) < Math.abs(resto - closest) ? current : closest;
    });

    // Adjust the rounded value to the closest rounding value
    let resultado = valorArrendondado - resto + valorProximo;

    return resultado;
}

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
