'use client'

import { FormEvent, useState } from 'react'
import { IValores } from '@/interfaces/IValores'
import Table from '@/components/Table/Table'
import Container from '@/components/Container/Container'
import styles from './page.module.css'
import './padrao.css'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import { IFatores } from '@/interfaces/IFatores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'

export default function Home() {

  const [valor, setValor] = useState('')
  // const [fatores, setFatores] = useState<IFatores>({
  //   padrao: '3',
  //   st: '1,01',
  //   transporte: '1,1',
  //   fator: '1,4',
  //   ipi: '1,065'
  // })
  const [fatores, setFatores] = useState<IFatores>({
    padrao: '',
    st: '',
    transporte: '',
    fator: '',
    ipi: ''
  })

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

    console.log(fatores);
    const listaFatores = Object.values((fatores)).map(fator => parseFloat(fator.replace(/,/g, '.')))

    console.log(listaFatores);

    if (valor) {

      const valorNumerico = parseFloat(valor.replace(/,/g, '.'))
      setValores([...valores, {
        unitario: valorNumerico,
        tabela1: calcularTabela(valorNumerico, listaFatores),
        tabela2: customRound(valorNumerico*1.5),
        tabela3: customRound((calcularTabela(valorNumerico, listaFatores))*1.3)
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
          {/* <form
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
          </form> */}
          <FatoresTable
            fatores={fatores}
            setFatores={setFatores}
            valor={valor}
            setValor={setValor}
            handleSubmit={adicionarValor}
          />
          {/* <Table
           size={{maxWidth: '300px'}}
           valores={fatores}
           setState={setFatores}
          /> */}
        </div>
        <Table 
          valores={valores}
          setState={setValores} 
        />
      </Container>
    </ section>

  )
}
