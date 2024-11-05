'use client'
import Container from '@/components/Container/Container'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'


const NotFound = () => {

  const router = useRouter()

  return (
    
    <Container>
    <span>
        <h1>404</h1>
        <h3>Página não encontrada</h3>
    </span>
    {/* <Link href='/'> */}
    <button onClick={() => router.back()}>Voltar</button>
    {/* </Link> */}
    </Container>
  )
}

export default NotFound