import { DocumentoImportado } from '@/hooks/useDocumento';
import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext"
import { IProduto } from "./IProduto"

export interface ICadastro {
    id: number
    created_at: string
    fornecedor: string | null
    produtos: ProdutoCadastro[]
    documentos?: { cte: DocumentoImportado, nfe: DocumentoImportado }
}