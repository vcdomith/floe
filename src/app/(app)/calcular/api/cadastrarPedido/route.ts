import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import { DocumentoImportado } from "@/hooks/useDocumento";
import { dbConnect } from "@/utils/db/supabase";
import { NextRequest, NextResponse } from "next/server";

const supabase = dbConnect()

interface Pedido {

    fornecedor: string
    produtos: ProdutoCadastro[]
    documentos: { cte: DocumentoImportado, nfe: DocumentoImportado, pedido?: DocumentoImportado }

}

export async function POST(request: NextRequest) {

    try {
        
        const { produtos, fornecedor, documentos }: Pedido = await request.json()
        
        if (produtos.length === 0) {
            return new Response('Não é possível cadastrar um pedido vazio', {
                status: 400
            })
        }

        const { data, error } = await supabase
            .from('cadastros')
            .insert({
                fornecedor: fornecedor,
                produtos: produtos,
                documentos: documentos,
            })

        if (error) return new Response(`Erro ao cadastrar pedido: ${error}`, {
            status: 500
        })

        return Response.json('Pedido cadastrado com sucesso!', {
            status: 200
        })

    } catch (error) {
        
        console.log('catch', error);
        return new Response(JSON.stringify(error), {
            status: 500
        })

    }


}