import { request } from "http";
import { revalidatePath } from "next/cache";

export async function POST(resquest: Request) {

    try {

        revalidatePath('/calcular')

    } catch(error) {
        
        return new Response(`Webhook Error: ${error}`, {
            status: 400
        })

    }

    return new Response('Sucess!', {
        status: 200,
    })

}