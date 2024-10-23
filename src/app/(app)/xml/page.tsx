'use client'
import Highlight from "@/components/Highlight/Highlight"
import { usePathname } from "next/navigation"
import { ChangeEvent, useRef, useState } from "react"

interface NfeData {

    fornecedor: string
    cnpj: string
    valorSt: string
    valorTotalProdutos: string

}

interface NfeProduto {

    codigo: string
    ean: string
    descricao: string
    ncm: string
    cst: string
    unitario: string
    ipi: string

}


const CH_CTE = '33240921570775000172570010000445011030675921'

export default function XML() {

    const path = usePathname()
    console.log(path);

    const [NfeData, setNfeData] = useState<NfeData>({
        fornecedor: '',
        cnpj: '',
        valorSt: '', 
        valorTotalProdutos: '',
    })
    const [produtos, setProdutos] = useState<NfeProduto[]>([])
    const [XML, setXML] = useState<Document | null>(null)
    const [chave, setChave] = useState('')

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
                const valorSt = xml.querySelector('vST')?.textContent
                const valorTotalProdutos = xml.querySelector('ICMSTot > vProd')?.textContent
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
                    const ipi = item.querySelector('pIPI')?.textContent || ''

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
                        ipi: ipi,
                    }

                    itensExtraidos.push(produto)

                })

                setNfeData({
                    fornecedor: fornecedor || '',
                    cnpj: cnpj || '',
                    valorSt: valorSt || '',
                    valorTotalProdutos: valorTotalProdutos || '',
                })

                setProdutos(itensExtraidos)

            }
            reader.readAsText(file)
        }

    }

    const parseXml = (res: string) => {
   
        const parser = new DOMParser()
        const xml = parser.parseFromString(res, 'application/xml')
        setXML(xml)

        const fornecedor = xml.querySelector('emit > xNome')?.textContent
        const cnpj = xml.querySelector('emit > CNPJ')?.textContent
        const itens = xml.querySelectorAll('infNFe > det')
        const valorSt = xml.querySelector('vST')?.textContent
        const valorTotalProdutos = xml.querySelector('ICMSTot > vProd')?.textContent
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
            const ipi = item.querySelector('pIPI')?.textContent || ''

            const produto = {
                codigo: codigo,
                ean: ean,
                descricao: descricao,
                ncm: ncm,
                cst: cst,
                unitario: unitario,
                ipi: ipi,
            }

            itensExtraidos.push(produto)

        })

        setNfeData({
            fornecedor: fornecedor || '',
            cnpj: cnpj || '',
            valorSt: valorSt || '',
            valorTotalProdutos: valorTotalProdutos || '',
        })

        setProdutos(itensExtraidos)

    }

    const handleGetCert = async (chave: string) => {

        if (chave.length < 44) {
            console.log('Chave nfe tem 44 digitos');
            return
        }

        const res = await fetch(`/xml/api/getNFe?chave=${chave}`)
        const cert = await res.json()

        parseXml(cert)

        console.log(cert);

    }

    const handleCTeRequest = async (chave: string) => {

        const res  = await fetch(`/xml/api/getCTe?chave=${chave}`)
        const json = await res.json()

        console.log(json);
        
        parseXml(json)

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
            <input type="text" minLength={44} maxLength={44} onChange={(e) => setChave(e.target.value)}/>
            <button onClick={() => handleGetCert(chave)}>Get cert</button>
            <button onClick={() => handleCTeRequest(CH_CTE)}>Request CTe</button>
        </section>
        <section style={{ overflowY: 'scroll' }}>
            {Object.entries(NfeData).map( ([ key, value ]) =>
                    <span key={key} style={{ display: 'flex', gap: '0.5rem', alignItems: "center",}}>
                        <Highlight>{key}:</Highlight>
                        <p style={{ margin: 0 }}>{value}</p>
                    </span>
            )}
            <ul style={{ overflowY: 'scroll'}}>
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