import Container from '@/components/Container/Container'
import Link from 'next/link'
import React from 'react'


const NotFound = () => {
  return (
    
    <Container>
    <span>
        <h1>404</h1>
        <h3>Página não encontrada</h3>
    </span>
    <Link href='/'>
          <button>Voltar home</button>
        </Link>
    </Container>
  )
}

export default NotFound