'use client'

import { FormEvent, useState } from 'react'
import { IValores } from '@/interfaces/IValores'
import Table from '@/components/Table/Table'
import Container from '@/components/Container/Container'
import styles from './page.module.css'
import './padrao.css'
import NumberInput from '@/components/NumberInput/NumberInput'
import { IFatores } from '@/interfaces/IFatores'

export default function Home() {

  const [valor, setValor] = useState('')
  const [fatores, setFatores] = useState<IFatores[]>([
    { origem: 'Padrão', fator: 3 }, 
    { origem: 'Transporte', fator: 1.01 },
    { origem: 'ST', fator: 1.1 },
    { origem: 'Fator', fator: 1.4 },
    { origem: 'IPI', fator: 1.065 },
  ])

  const [valores, setValores] = useState<IValores[]>([])
  const [listaFatores, setListaFatores] = useState< (IFatores[])[] >([])

  function calcularTabela(valor: number, args: number[]): number {

    return customRound(args.reduce((acc, atual) => acc * atual, valor))

  }

  // const adicionarItem = (evento: FormEvent<HTMLFormElement>) => {
  //   evento.preventDefault()

  //   atualizarFatores()
  //   const listaFatores = fatores.map(item => item.fator)

  //   adicionarValor()

  // }


  const adicionarValor = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const fatoresAplicados = fatores.map(item => item.fator)

    if (valor) {

      const valorNumerico = parseFloat(valor.replace(/,/g, '.'))
      setValores([...valores, {
        unitario: valorNumerico,
        tabela1: calcularTabela(valorNumerico, fatoresAplicados),
        tabela2: customRound(valorNumerico*1.5),
        tabela3: customRound((calcularTabela(valorNumerico, fatoresAplicados))*1.3)
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
    
    // console.table(a);
  
    if (diffToFloor <= diffToHalfFloor && diffToFloor <= diffToNextFloor) {
      return floorValue - 0.02;
    } else if (diffToHalfFloor <= diffToNextFloor) {
      return halfFloorValue;
    } else {
      return nextFloorValue - 0.02;
    }
  }

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.container}>
          <form
            className={styles.form} 
            onSubmit={adicionarValor}
            >
              <NumberInput
                label='Valor Unitário'
                placeholder='Digite o valor unitário'
                valor={valor}
                setValor={setValor}
              />
              <NumberInput
                label='Porcentagem IPI'
                placeholder='Porcentagem ex: 6,5%'
                valor={valor}
                setValor={setValor}
              />
              <NumberInput
                label='Porcentagem IPI'
                placeholder='Porcentagem ex: 6,5%'
                valor={valor}
                setValor={setValor}
              />
              <NumberInput
                label='Porcentagem IPI'
                placeholder='Porcentagem ex: 6,5%'
                valor={valor}
                setValor={setValor}
              />
            <button className={styles.botao}>Adicionar</button>
            <select 
              className={styles.botao}
            >
              <option value="normal">Normal</option>
              <option value="st">ST</option>
            </select>
          </form>
          <Table
           size={{maxWidth: '300px'}}
           valores={fatores}
           setState={setFatores}
          />
        </div>
        <Table 
          valores={valores}
          setState={setValores} 
        />
      </Container>
    </ section>

  )
}
