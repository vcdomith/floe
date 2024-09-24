import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";
import { DistribuicaoNFe } from "@vexta-systems/node-mde";
import { Builder, Parser, parseString } from 'xml2js'

const supabase = dbConnect()

const blobToBuffer = async (blob: Blob) => {

    const arrayBuffer = await blob.arrayBuffer()

    return Buffer.from(arrayBuffer)

}

async function parseAndBuildXml(xml: string) {

    const parsedResult = await new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })

    const builder = new Builder()
    return builder.buildObject(parsedResult)

}

type COD_UF = "11" | "12" | "13" | "14" | "15" | "16" | "17" | "21" | "22" | "23" | "24" | "25" | "26" | "27" | "28" | "29" | "31" | "32" | "33" | "35" | "41" | "42" | "43" | "50" | "51" | "52" | "53"

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const chNfe = searchParams.get('chave')!

    const {data: cert, error} = await supabase
        .storage
        .from('test')
        .download('cert/certificado.pfx')
    
    const certBuffer = await blobToBuffer(cert!)

    const distribuição = new DistribuicaoNFe({
        pfx: certBuffer,
        passphrase: process.env.NFE_CERT_SECRET!,
        cnpj: '05079279000164',
        cUFAutor: chNfe.slice(0,2) as COD_UF,
        tpAmb: '1',
    })
    
    const consulta = await distribuição.consultaChNFe(
        chNfe
    )

    // console.log(consulta.data.docZip[0].json);

    // const xml = parseAndBuildXml(consulta.data.docZip[0].xml)

    // const parser = new Parser()

    // const xml = parser.parseString(consulta.data.docZip[0].xml, (err, result) => {

    //     if (err) {
    //         console.error(err)
    //         return
    //     }

    //     const builder = new Builder()
    //     const xml = builder.buildObject(result)

    //     return xml

    // })

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500
        })
    }

    return new Response(JSON.stringify(consulta.data.docZip[0].xml), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })

}