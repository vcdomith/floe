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
    const chCTe = searchParams.get('chave')!

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
        cUFAutor: chCTe.slice(0,2) as COD_UF,
        tpAmb: '1',
    })

    if (nsu?.cte === null) {

        //Consulta distribuicao.consultaNSU(0)
        const consultaMaxNsu = await distribuição.consultaNSU('0')
        // console.log('consultaMaxNsu', consultaMaxNsu);

        //Get maxNsu da resposta
        const maxNSU = consultaMaxNsu.data.maxNSU

        //Consulta distribuicao.consultaUltNSU(maxNSu - 100)
        console.log('Fazendo consulta initial e alimentando DB...');
        const consulta = await distribuição.consultaUltNSU((parseInt(maxNSU) - 50).toString())
        console.log('consulta', consulta);

        //Filtra, transforma os resultados para o seguinte formato: {nsu: string, chCTe: string}[]
        const ultNsu = consulta.data.ultNSU
        const dados = consulta.data.docZip
        const resFiltrado = dados
            .filter( dado => dado.schema.includes('procCTe'))
            .map((registro) => ({
                criado_em: registro.json.cteProc.CTe.infCte.ide.dhEmi,
                nsu: registro.nsu,
                chCTe: registro.json.cteProc.CTe.infCte['@_Id'].slice(3),
                xml: registro.xml,
            }))
        // console.log('resFiltrado', resFiltrado);

        //Registra relações nsu e ch para db
        const { data, error } = await supabase
            .from('ctes')
            .insert(resFiltrado)
        if (error) console.log(error);

        // //Cria row ultNSU com o ultNsu Cte na db
        const { data: dataNsu, error: errorNsu } = await supabase
            .from('ultNSU')
            .update({ cte: ultNsu })
            .eq('id', 1)
            .select()
        if (errorNsu) console.log(errorNsu);

        const resCh = resFiltrado.filter( cadastro => cadastro.chCTe === chCTe )
        console.log('resCh', resCh );

        if (resCh.length > 0) {

            // const nsuQuery = resCh[0].nsu
            // console.log(nsuQuery);
            // const consultaCTe = await distribuição.consultaNSU(nsuQuery)
            // console.log(consultaCTe);

            return new Response(JSON.stringify(resCh[0].xml), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        return new Response(JSON.stringify(`Nenhuma CTe com a chave ${chCTe} foi encontrado`), {
            status: 404
        })

    }

    const { data: cte, error: errorMatchingCTe } = await supabase
        .from('ctes')
        .select('*')
        .eq('chCTe', chCTe)
        .single()
       
    if (errorMatchingCTe) {
        return new Response(JSON.stringify({ error: errorMatchingCTe.message }), {
            status: 404
        })
    }  

    return new Response(JSON.stringify(cte.xml), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })

}