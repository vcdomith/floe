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

    console.log(consulta.data.docZip);

    const dados = consulta.data.docZip
    const resFiltrado = dados
        .filter( dado => dado.schema.includes('procNFe'))
        .map((registro) => ({
            criado_em: registro.json.nfeProc.NFe.infNFe.ide.dhEmi,
            nsu: registro.nsu,
            chNFe: registro.json.nfeProc.NFe.infNFe['@_Id'].slice(3),
            xml: registro.xml,
        }))
    console.log('resFiltrado', resFiltrado);

    //Registra relações nsu e ch para db
    const { data, error: errorNFe } = await supabase
        .from('nfes')
        .insert(resFiltrado)
    if (error) console.log(error);

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

// export async function GET(request: NextRequest) {

//     const searchParams = request.nextUrl.searchParams
//     const chNfe = searchParams.get('chave')!

//     const { data: cert, error: certError } = await supabase
//     .storage
//     .from('test')
//     .download('cert/certificado.pfx')

//     const certBuffer = await blobToBuffer(cert!)

//     const { data: nsu, error } = await supabase
//         .from('ultNSU')
//         .select('nfe')
//         .single()

//     console.log(nsu);

//     //LA375383
//     const distribuição = new DistribuicaoNFe({
//         pfx: certBuffer,
//         passphrase: process.env.NFE_CERT_SECRET!,
//         cnpj: '05079279000164',
//         cUFAutor: chNfe.slice(0,2) as COD_UF,
//         tpAmb: '2',
//     })

//     if (nsu?.nfe === null) {

//         //Consulta distribuicao.consultaNSU(0)
//         const consultaMaxNsu = await distribuição.consultaNSU('0')
//         console.log('consultaMaxNsu', consultaMaxNsu);

//         //Get maxNsu da resposta
//         const maxNSU = consultaMaxNsu.data.maxNSU

//         //Consulta distribuicao.consultaUltNSU(maxNSu - 100)
//         console.log('Fazendo consulta initial e alimentando DB...');
//         const consulta = await distribuição.consultaUltNSU((parseInt(maxNSU) - 50).toString())
//         console.log('consulta', consulta);

//         //Filtra, transforma os resultados para o seguinte formato: {nsu: string, chCTe: string}[]
//         const ultNsu = consulta.data.ultNSU
//         const dados = consulta.data.docZip
//         const resFiltrado = dados
//             .filter( dado => dado.schema.includes('procNFe'))
//             .map((registro) => ({
//                 criado_em: registro.json.nfeProc.NFe.infNFe.ide.dhEmi,
//                 nsu: registro.nsu,
//                 chNFe: registro.json.nfeProc.NFe.infNFe['@_Id'].slice(3),
//                 xml: registro.xml,
//             }))
//         console.log('resFiltrado', resFiltrado);

//         //Registra relações nsu e ch para db
//         const { data, error } = await supabase
//             .from('nfes')
//             .insert(resFiltrado)
//         if (error) console.log(error);

//         // //Cria row ultNSU com o ultNsu Cte na db
//         const { data: dataNsu, error: errorNsu } = await supabase
//             .from('ultNSU')
//             .update({ cte: ultNsu })
//             .eq('id', 1)
//             .select()
//         if (errorNsu) console.log(errorNsu);

//         const resCh = resFiltrado.filter( cadastro => cadastro.chNFe === chNfe )
//         console.log('resCh', resCh );

//         if (resCh.length > 0) {

//             // const nsuQuery = resCh[0].nsu
//             // console.log(nsuQuery);
//             // const consultaCTe = await distribuição.consultaNSU(nsuQuery)
//             // console.log(consultaCTe);

//             return new Response(JSON.stringify(resCh[0].xml), {
//                 status: 200,
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             })
//         }

//         return new Response(JSON.stringify(`Nenhuma CTe com a chave ${chNfe} foi encontrado`), {
//             status: 404
//         })

//     }

//     if (error) {
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 500
//         })
//     }

//     return new Response(JSON.stringify(nsu), {
//         status: 200,
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })

// }