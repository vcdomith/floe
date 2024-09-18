'use client'
import Highlight from "@/components/Highlight/Highlight"
import { ChangeEvent, useRef, useState } from "react"

interface NfeData {

    fornecedor: string | null
    cnpj: string | null

}

interface NfeProduto {

    codigo: string
    ean: string
    descricao: string
    ncm: string
    cst: string
    unitario: string

}

export default function XML() {

    const [NfeData, setNfeData] = useState<NfeData>({
        fornecedor: '',
        cnpj: '',
    })
    const [produtos, setProdutos] = useState<NfeProduto[]>([])
    const [XML, setXML] = useState<Document | null>(null)

    const NfeXMLParser = (file: File) => {

        const reader = new FileReader()
        reader.onload = function (e) {
            
            const text = e.target?.result as string
            const parser = new DOMParser()
            const xml = parser.parseFromString(text, 'application/xml')
            setXML(xml)

            const fornecedor = xml.querySelector('emit > xNome')?.textContent
            const cnpj = xml.querySelector('emit > CNPJ')?.textContent
            const itens = xml.querySelector('det')?.textContent

            console.log(fornecedor, cnpj, itens);

            const nfeData = {

                fornecedor: fornecedor || '',
                cnpj: cnpj || '',

            }

        }

        return reader.readAsText(file)

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        // console.log(fileList);

        if (file) {
            const reader = new FileReader()
            reader.onload = function (e) {
                const text = e.target?.result as string
                const parser = new DOMParser()
                const xml = parser.parseFromString(text, 'application/xml')
                setXML(xml)

                const fornecedor = xml.querySelector('emit > xNome')?.textContent
                const cnpj = xml.querySelector('emit > CNPJ')?.textContent
                const itens = xml.querySelectorAll('infNFe > det')
                console.log(fornecedor, cnpj);
                console.log(itens);

                const itensExtraidos: NfeProduto[] = []
                itens.forEach( item => {

                    const codigo = item.querySelector('cProd')?.textContent || ''
                    const ean = item.querySelector('cEAN')?.textContent || ''
                    const descricao = item.querySelector('xProd')?.textContent || ''
                    const ncm = item.querySelector('NCM')?.textContent || ''
                    const cst = item.querySelector('CST')?.textContent || ''
                    const unitario = item.querySelector('vUnCom')?.textContent || ''

                    // const produto: NfeProduto = {
                    //     codigo: item.querySelector('cProd')?.textContent || '',
                    //     ean: item.querySelector('cEAN')?.textContent || '',
                    //     descricao: item.querySelector('xProd')?.textContent || '',
                    //     ncm: item.querySelector('NCM')?.textContent || '',
                    //     cst: item.querySelector('CST')?.textContent || '',
                    //     unitario: item.querySelector('vUnCom')?.textContent || '',
                    // }

                    const produto = {
                        codigo: codigo,
                        ean: ean,
                        descricao: descricao,
                        ncm: ncm,
                        cst: cst,
                        unitario: unitario,
                    }

                    itensExtraidos.push(produto)

                })

                setNfeData({
                    fornecedor: fornecedor || '',
                    cnpj: cnpj || '',
                })

                setProdutos(itensExtraidos)

            }
            reader.readAsText(file)
        }

    }

    return (
        <main>
        <section>
            <h3>Importe XML para ver infos</h3>
            <input 
                type="file" 
                accept='.xml' 
                name="file" 
                id="file" 
                onChange={(e) => handleChange(e)}
            />
        </section>
        <section style={{ overflowY: 'scroll' }}>
            {Object.entries(NfeData).map( ([ key, value ]) =>
                <>
                    <h1 key={key}>{key}</h1>
                    <h3>{value}</h3>
                </>
            )}
            <ul>
                {produtos.map( (produto) => 
                    <li key={produto.codigo} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}>
                        {Object.entries(produto).map( ([key,value]) => 
                            <div key={key} style={{ display: 'flex', gap: '0.5rem'}}>
                                <Highlight>{key}:</Highlight>
                                <p style={{ display: 'flex', alignItems: 'center', margin: 0 }}>{value}</p>
                            </div>
                        )}
                    </li>
                )}
            </ul>
            {/* {XML&& new XMLSerializer().serializeToString(XML)} */}
        </section>
        </main>
    )

}