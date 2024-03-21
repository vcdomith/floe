import { IProduto } from "./IProduto"

export interface ICadastro {
    id: number
    produtos: IProduto[]
    data: string
} 