import { IFornecedor } from "@/interfaces/IFornecedor";
import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";

const supabase = dbConnect()

export interface CadastroFornecedor {
    fornecedor: IFornecedor
}

export async function POST(request: NextRequest) {
    
    try {
        
        const { fornecedor }: CadastroFornecedor = await request.json()

        if (!fornecedor) {
            return new Response('Não é possível cadastrar fornecedor vazio ou corrompido, conferir request', {
                status: 400
            })
        }

        if ( Object.values(fornecedor).some( value => value === '') ){
            return new Response('Não é possível cadastrar um fornecedor com valor vazio', {
                status: 400
            })
        }

        const { data, error } = await supabase
            .from('fornecedores')
            .insert(fornecedor)

        if (error){
            return new Response(`Erro ao cadastrar fornecedor na DB erro:${error}`, {
                status: 500
            })
        }

        return Response.json('Fornecedor cadastrado com sucesso!', {
            status: 200
        })

    } catch (error) {
        
        console.log('catch', error);
        return new Response(JSON.stringify(error), {
            status: 500
        })

    }

}