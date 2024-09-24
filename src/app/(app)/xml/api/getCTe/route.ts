import { dbConnect } from "@/utils/db/supabase";
import { NextRequest } from "next/server";
import { DistribuicaoCTe } from '@vexta-systems/node-mde'

const supabase = dbConnect()

const blobToBuffer = async (blob: Blob) => {

    const arrayBuffer = await blob.arrayBuffer()

    return Buffer.from(arrayBuffer)

}

type COD_UF = "11" | "12" | "13" | "14" | "15" | "16" | "17" | "21" | "22" | "23" | "24" | "25" | "26" | "27" | "28" | "29" | "31" | "32" | "33" | "35" | "41" | "42" | "43" | "50" | "51" | "52" | "53"

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const chNfe = searchParams.get('chave')!

    const {data: cert, error: certError } = await supabase
    .storage
    .from('test')
    .download('cert/certificado.pfx')

    const certBuffer = await blobToBuffer(cert!)

    const { data: nsu, error } = await supabase
        .from('ultNSU')
        .select('cte')
        .single()

    console.log(nsu);

    //LA375383
    const distribuição = new DistribuicaoCTe({
        pfx: certBuffer,
        passphrase: process.env.NFE_CERT_SECRET!,
        cnpj: '05079279000164',
        cUFAutor: chNfe.slice(0,2) as COD_UF,
        tpAmb: '1',
    })

    if (nsu?.cte === null) {
        //Consulta distribuicao.consultaNSU(0)
        const consultaMaxNsu = await distribuição.consultaNSU('0')
        console.log('consultaMaxNsu', consultaMaxNsu);
        //Get maxNsu da resposta
        const maxNSU = consultaMaxNsu.data.maxNSU
        //Consulta distribuicao.consultaUltNSU(maxNSu - 100)
        const consulta = await distribuição.consultaUltNSU((parseInt(maxNSU) - 10).toString())
        console.log('cosulta', consulta);
        //Filtra, transforma os resultados para o seguinte formato: {nsu: string, chCTe: string}[]
        const ultNsu = consulta.data.ultNSU
        const dados = consulta.data.docZip
        const resFiltrado = dados
            .filter( dado => dado.schema.includes('procCTe'))
            .map((registro) => ({
                chCTe: registro.json.cteProc.CTe.infCte['@_Id'].slice(3),
                nsu: registro.nsu
            }))
        console.log('resFiltrado', resFiltrado);
        //Registra relações nsu e ch para db
        // const { data, error } = await supabase
        //     .from('ctes_nsu')
        //     .insert(resFiltrado)
        // if (error) console.log(error);
        // //Cria row ultNSU com o ultNsu Cte na db
        // const { data: dataNsu, error: errorNsu } = await supabase
        //     .from('ultNSU')
        //     .update({ cte: ultNsu })
        //     .eq('id', 1)
        //     .select()
        // if (errorNsu) console.log(errorNsu);

        const resCh = resFiltrado.filter( cadastro => cadastro.chCTe === chNfe)
        console.log('resCh', resCh);

        if (resCh.length > 0) {
            const nsuQuery = resCh[0].nsu
            console.log(nsuQuery);
            const consultaCTe = await distribuição.consultaNSU(nsuQuery)
            console.log(consultaCTe);

            return new Response(JSON.stringify(consultaCTe.data.docZip[0].xml), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

    }

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500
        })
    }

    return new Response(JSON.stringify(nsu), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })

}