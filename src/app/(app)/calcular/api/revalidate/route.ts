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

export async function GET(req: Request) {

    try {

        console.log(req);
        revalidatePath('/calcular')

    } catch (error) {

        return new Response(`Error: ${error}`, {
            status: 400
        })

    }

    return new Response('Sucess!', {
        status: 200,
    })

}