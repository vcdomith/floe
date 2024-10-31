
import Highlight from '@/components/Highlight/Highlight'
import style from './calcular.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Calcular() {

    redirect('/calcular/chave')

}