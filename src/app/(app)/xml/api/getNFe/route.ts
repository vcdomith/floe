import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";
import { DistribuicaoDFe } from "node-mde";
import { Builder, Parser, parseString } from 'xml2js'
import { last } from "lodash";

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

interface RegistroNFe {
    nsu: string
    chNFe: string
    xml: string
}

type COD_UF = "11" | "12" | "13" | "14" | "15" | "16" | "17" | "21" | "22" | "23" | "24" | "25" | "26" | "27" | "28" | "29" | "31" | "32" | "33" | "35" | "41" | "42" | "43" | "50" | "51" | "52" | "53"

// export async function GET(request: NextRequest) {

//     const searchParams = request.nextUrl.searchParams
//     const chNfe = searchParams.get('chave')!

//     const {data: cert, error} = await supabase
//         .storage
//         .from('test')
//         .download('cert/certificado.pfx')
    
//     const certBuffer = await blobToBuffer(cert!)

//     const distribuição = new DistribuicaoNFe({
//         pfx: certBuffer,
//         passphrase: process.env.NFE_CERT_SECRET!,
//         cnpj: '05079279000164',
//         cUFAutor: chNfe.slice(0,2) as COD_UF,
//         tpAmb: '1',
//     })
    
//     const consulta = await distribuição.consultaChNFe(
//         chNfe
//     )

//     console.log(consulta.data.docZip);

//     const dados = consulta.data.docZip
//     const resFiltrado = dados
//         .filter( dado => dado.schema.includes('procNFe'))
//         .map((registro) => ({
//             criado_em: registro.json.nfeProc.NFe.infNFe.ide.dhEmi,
//             nsu: registro.nsu,
//             chNFe: registro.json.nfeProc.NFe.infNFe['@_Id'].slice(3),
//             xml: registro.xml,
//         }))
//     console.log('resFiltrado', resFiltrado);

//     //Registra relações nsu e ch para db
//     const { data, error: errorNFe } = await supabase
//         .from('nfes')
//         .insert(resFiltrado)
//     if (error) console.log(error);

//     if (error) {
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 500
//         })
//     }

//     return new Response(JSON.stringify(consulta.data.docZip[0].xml), {
//         status: 200,
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })

// }

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const chNfe = searchParams.get('chave')!

    const { data: cert, error: certError } = await supabase
    .storage
    .from('test')
    .download('cert/certificado.pfx')
    
    const certBuffer = await blobToBuffer(cert!)    

    const { data: nsu, error } = await supabase
        .from('ultNSU')
        .select('nfe')
        .single()

    console.log(nsu);

    const distribuicao = new DistribuicaoDFe({
        pfx: certBuffer,
        passphrase: process.env.NFE_CERT_SECRET!,
        cnpj: '05079279000164',
        cUFAutor: chNfe.slice(0,2) as COD_UF,
        tpAmb: '1',
    })

    if (nsu?.nfe === null) {

        let ultNSU: string | null = null
        let maxNSU: string | null = null
        let cStat: string | null = null
        let cadastrosNFe: RegistroNFe[] = []

        try {
            
            // //Consulta inicial para conseguir ultNSU
            const consultaInicial = await distribuicao.consultaNSU('0')
            const ultNsuInicial = consultaInicial.data.ultNSU
            console.log('consulta inicial', consultaInicial);
            console.log('ultNsuInicial', ultNsuInicial);

            //Consulta inicial para o distribuicao.
            // ** IMPORTANTE: sempre salvar o ultNSU **
            const consulta = await distribuicao.consultaUltNSU(ultNsuInicial)
            console.log('consulta inicial com ultNsu', consulta);

            // const nextUltNSU = consulta.data.docZip.at(-1)?.nsu!
            // console.log('nextUltNSU' ,nextUltNSU);

            ultNSU = consulta.data.ultNSU
            maxNSU = consulta.data.maxNSU
            cStat = consulta.data.cStat

            const result: RegistroNFe[] = consulta.data.docZip
                .filter((registro) => registro.schema.includes('procNFe'))
                .map((registro) => ({
                    nsu: registro.nsu,
                    chNFe: registro.json.nfeProc.NFe.infNFe['@_Id'].slice(3),
                    xml: registro.xml,
                }))

            cadastrosNFe.push(...result)

            console.log('ultNSU', ultNSU);
            console.log('maxNSU', maxNSU);
            console.log(ultNSU < maxNSU && cStat !== '137' && cStat !== '656');

            while (ultNSU < maxNSU && cStat !== '137' && cStat !== '656') {

                const consulta = await distribuicao.consultaUltNSU(ultNSU)
                console.log('consulta loop', consulta.data.cStat, consulta.data.xMotivo);

                // const nextUltNSU = consulta.data.docZip.at(-1)?.nsu!

                ultNSU = consulta.data.ultNSU
                maxNSU = (consulta.data.maxNSU !== maxNSU) ? consulta.data.maxNSU : maxNSU
                cStat = (consulta.data.cStat !== cStat) ? consulta.data.cStat : cStat

                const result: RegistroNFe[] = consulta.data.docZip
                .filter((registro) => registro.schema.includes('procNFe'))
                .map((registro) => ({
                    criado_em: registro.json.nfeProc.NFe.infNFe.ide.dhEmi,
                    nsu: registro.nsu,
                    chNFe: registro.json.nfeProc.NFe.infNFe['@_Id'].slice(3),
                    xml: registro.xml,
                }))

                cadastrosNFe.push(...result)

            }

            console.log(cadastrosNFe);

            const chavesMemo = new Set()

            const filteredResult = cadastrosNFe.filter( (cadastro: RegistroNFe) => {

                if (chavesMemo.has(cadastro.chNFe)) {
                    return false
                }

                chavesMemo.add(cadastro.chNFe)
                return true

            })

            const { data: _, error: errorNFes } = await supabase
                .from('nfes')
                .insert(filteredResult)

            if (errorNFes) {
                console.log(errorNFes.message);
                return new Response(JSON.stringify("Failed to insert NFes data"), { status: 500 });
            }

            const { data, error: errorNSU } = await supabase
                .from('ultNSU')
                .update({ nfe: ultNSU })
                .eq('id', 1)
                .select()

            if (errorNSU) {
                console.log(errorNSU.message);
                return new Response(JSON.stringify("Failed to update NSU"), { status: 500 });
            }

            const matchedChave = filteredResult.find( cadastro => cadastro.chNFe === chNfe )
            if (matchedChave) {
                return new Response(JSON.stringify(matchedChave.xml), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            } 

            return new Response(JSON.stringify(`Nenhuma NFe com a chave ${chNfe} foi encontrada`), {
                status: 404
            })

        } catch (error) {
            
            return new Response(JSON.stringify(`Ocorreu um erro: ${error}`), {
                status: 500
            })

        }
    
    }

    //Procura chave na DB, se não encontrar faz uma consultaUltNsu com nsu, caso não encontre retorna mensagem de erro não encontrou

    try {

        const consulta = await distribuicao.consultaChNFe(chNfe)
        console.log('consulta fora',consulta);
        const nfe = consulta.data.docZip[0].xml
        return new Response(JSON.stringify(nfe), {
            status: 200
        })
        
    } catch (error) {

        return new Response(JSON.stringify({ error: error }), {
            status: 500
        })

    }

    // if (error) {
    //     return new Response(JSON.stringify({ error: error.message }), {
    //         status: 500
    //     })
    // }

    // return new Response(JSON.stringify(nsu), {
    //     status: 200,
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })

}