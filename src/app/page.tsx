'use client'

import { FormEvent, useEffect, useState } from 'react'
import { IValores } from '@/interfaces/IValores'
import Table from '@/components/Table/Table'
import Container from '@/components/Container/Container'
import styles from './page.module.css'
import './padrao.css'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import { IFatores } from '@/interfaces/IFatores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'
import { IProduto } from '@/interfaces/IProduto'

export default function Home() {

  const [valor, setValor] = useState('')
  const [fatores, setFatores] = useState<IFatores>({
    padrao: '3',
    st: '1,01',
    transporte: '1,1',
    fator: '1,4',
    ipi: '1,065'
  })
  // const [fatores, setFatores] = useState<IFatores>({
  //   padrao: '',
  //   st: '',
  //   transporte: '',
  //   fator: '',
  //   ipi: ''
  // })

  const [valores, setValores] = useState<IValores[]>([])
  const [controleProdutos, setControleProdutos] = useState<IProduto[]>([])
  const [fatorAtual, setFatorAtual] = useState<{fator: string, valor: string}>({fator: '', valor: ''})

  const adicionarValor = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (valor) {

      setControleProdutos([...controleProdutos, {
        fatores: fatores,
        unitario: valor,
      }])

      setValor('')
    }
  }
  //testar isso apra implementar
  const updateFatoresAtuais = (id: string, valor: string) => {

    return () => {

        setFatores((prev) => {
        const updateFator = {...prev, [id]: valor}
        return updateFator
        
      })
    }

  }

  const updateFatoresProduto = (index: number): ((func: (arr: IFatores, fator: string) => IFatores) => void) => {                                 

    // return (fator) => {

    //   setControleProdutos(prev => {
    //     const update = [...prev]
    //     update[index].fatores[fatorAtual.fator as keyof IFatores] = fatorAtual.valor
    //     // console.log(update);
    //     return update
    //   })

    // }
    return () => {

    }


  }

  const updateValorProduto = (index: number): ((valor: string) => void) => {

    return (valor) => {

      setControleProdutos(prev => {
        const update = [...prev]
        update[index].unitario = valor
        return update
      })

    }
    
  }
  
  useEffect(() => {

    console.log(fatorAtual);

  }, [fatorAtual])

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.container}>
          <FatoresTable
            fatores={fatores}
            setFatores={setFatores}
            valor={valor}
            setValor={updateFatoresAtuais}
            handleSubmit={adicionarValor}
          />
        </div>
        <Table 
          valores={valores}
          setState={setValores} 
          controleProdutos={controleProdutos}
          setControleProdutos={setControleProdutos}
          setFatores={updateFatoresProduto}
          setValor={updateValorProduto}
          setFatorAtual={setFatorAtual}
        />
      </Container>
    </ section>

  )
}
