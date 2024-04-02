import { IProduto } from "./IProduto"

export interface ICadastro {
    id: number
    created_at: string
    produtos: IProduto[]
}