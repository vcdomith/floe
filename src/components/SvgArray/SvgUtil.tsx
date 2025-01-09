import { FatoresContext, ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import { IFatores } from "@/interfaces/IFatores";
import React, { ReactNode } from "react";

const SvgProduto_3D = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M449 135L250 20L51 135V365L250 480L449 365V135Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M449 365V135L250 250.649V480L449 365Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M449 135L250 20L51 135L250 250.649L449 135Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M51 365L250 480V250.649L51 135V365Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        </svg>
    )
}

const SvgCodigo = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M407 365.704C329.979 303.655 330.739 417.926 253.718 355.876C176.698 293.826 169.448 418.269 92 355.876" stroke="black" strokeWidth="40"/>
        <path d="M33 413V87C33 64.9086 50.9086 47 73 47H419.26C446.178 47 468 68.8345 468 95.7688V404.231C468 431.165 446.169 453 419.251 453H355.285H73C50.9086 453 33 435.091 33 413Z" stroke="black" strokeWidth="40"/>
        <line x1="117" y1="102" x2="117" y2="289" stroke="black" strokeWidth="40"/>
        <line x1="202" y1="102" x2="202" y2="238" stroke="black" strokeWidth="40"/>
        <line x1="287" y1="102" x2="287" y2="238" stroke="black" strokeWidth="40"/>
        <line x1="375" y1="102" x2="375" y2="289" stroke="black" strokeWidth="40"/>
        </svg>

    )
}
const SvgNCM = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M481 414.43C367.303 350.586 368.425 478.274 254.727 414.43C141.03 350.586 130.327 478.628 16 414.43" stroke="black" strokeWidth="40"/>
        <rect x="34" y="87" width="160" height="226" rx="33.5" stroke="black" strokeWidth="40"/>
        <rect x="250" y="87" width="80" height="226" rx="33.5" stroke="black" strokeWidth="40"/>
        <rect x="386" y="87" width="80" height="226" rx="33.5" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

const SvgFornecedor = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M463 437.5C426.388 437.619 412.769 374.8 342.5 375C272.231 375.201 266.172 437.5 197.5 437.5C133.619 437.5 68.0749 387.76 37 387.277" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M463 342.5C426.388 342.619 412.769 279.8 342.5 280C272.231 280.201 266.172 342.5 197.5 342.5C133.619 342.5 68.0749 292.76 37 292.277" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M169 144L50.5 181.5C101.414 241.835 195.827 310.885 236.5 322.284L328.5 279C395 264.5 411.5 183.5 444 134.5L169 144Z" fill="none" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="bevel"/>
            <path d="M271 142V99.4808M271 99.4808V43L202 70.9231L271 99.4808Z" stroke="#E8D4B0" strokeWidth="40"/>
        </svg>
    )
}

const SvgST = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M214 311L298 395L214 479" stroke="black" strokeWidth="40"/>
            <path d="M298 189L214 105L298 21" stroke="black" strokeWidth="40"/>
            <path d="M156 105C76 105 12 118.5 115 221.5C218 324.5 76 275.67 76 315.294C76 325.8 78.0692 336.203 82.0896 345.909C86.11 355.615 92.0028 364.434 99.4315 371.862C106.86 379.291 115.679 385.184 125.385 389.204C135.091 393.225 145.494 395.294 156 395.294H270.11" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M354.11 395.294C434.11 395.294 498.11 381.794 395.11 278.794C292.11 175.794 434.11 224.624 434.11 185C434.11 174.494 432.041 164.091 428.02 154.385C424 144.679 418.107 135.86 410.679 128.431C403.25 121.003 394.431 115.11 384.725 111.09C375.019 107.069 364.616 105 354.11 105L240 105" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        </svg>
    )
}
const SvgDesconto = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M411.039 361C411.039 388.614 389.092 411 362.02 411C334.947 411 313 388.614 313 361C313 333.386 334.947 311 362.02 311C389.092 311 411.039 333.386 411.039 361Z" stroke="black" strokeWidth="40"/>
            <path d="M190.961 131C190.961 158.614 168.136 181 139.98 181C111.825 181 89 158.614 89 131C89 103.386 111.825 81 139.98 81C168.136 81 190.961 103.386 190.961 131Z" stroke="black" strokeWidth="40"/>
            <path d="M69 431C249.5 431 69 250.5 249.5 250.5C430 250.5 249.5 61 431 61" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgIPI = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90.7028 148L66 438H131.5H197L172.297 148H131.5H90.7028Z" stroke="black" strokeWidth="40"/>
            <path d="M441.685 320.685C365.914 244.914 362.156 399.378 286.803 324.024C236.834 274.055 220.001 323.494 192.357 340.5" stroke="black" strokeWidth="40"/>
            <path d="M197 439H435V314" stroke="black" strokeWidth="40"/>
            <path d="M129 70.1853C206.332 -7.14683 206.332 147.517 283.664 70.1853C360.996 -7.14683 364.852 151.373 442.613 73.6127" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgUnitarioNota = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M87.8767 246.979C-2.61686 155.99 178.37 155.99 87.8767 65L421.877 65C512.37 155.99 331.383 155.99 421.877 246.979C512.37 337.969 326.871 342.506 417.866 434L83.866 434C-7.12898 342.506 178.37 337.969 87.8767 246.979Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <line x1="160" y1="159" x2="339" y2="159" stroke="black" strokeWidth="40"/>
            <line x1="177" y1="257" x2="356" y2="257" stroke="black" strokeWidth="40"/>
            <line x1="153" y1="351" x2="332" y2="351" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgComposto = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M179 250C179 277.614 156.614 300 129 300C101.386 300 79 277.614 79 250C79 222.386 101.386 200 129 200C156.614 200 179 222.386 179 250Z" stroke="black" strokeWidth="40"/>
            <path d="M420 250C420 277.614 397.614 300 370 300C342.386 300 320 277.614 320 250C320 222.386 342.386 200 370 200C397.614 200 420 222.386 420 250Z" stroke="black" strokeWidth="40"/>
            <path d="M249.589 87C330.688 171.845 168.489 171.008 249.589 255.853C330.688 340.698 168.04 348.685 249.589 434" stroke="black" strokeWidth="40"/>
            <path d="M216.5 83H60C37.9086 83 20 100.909 20 123V376C20 398.091 37.9086 416 60 416H186" stroke="black" strokeWidth="40"/>
            <path d="M307.5 83H440C462.091 83 480 100.909 480 123V376C480 398.091 462.091 416 440 416H282" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

const SvgDefault = () => {
    return(
        <svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 150.278 180.487 198.278 211.82" stroke="#591C4A" strokeWidth="40"/>
        <path d="M474.07 98.893C465.57 92.393 350.07 7.89299 305.57 43.893C261.07 79.893 498.57 212.393 474.07 298.893C454.47 368.093 353.57 322.726 305.57 291.393" stroke="#591C4A" strokeWidth="40"/>
        <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
        </svg>
    )
}

const SvgProduto = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M449 135L250 20L51 135V365L250 480L449 365V135Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        <path d="M250 250.649C327.714 205.876 371.286 180.773 449 136M250 250.649C172.286 205.876 128.714 180.773 51 136M250 250.649V473" stroke="black" strokeWidth="40"/>
        <path d="M149 69C227.105 113.841 270.895 138.981 349 183.822C349 183.822 349 268.648 349 323" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

function SvgPlus() {

    return (
        <svg width="40" height="40" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M393 249L107 249" stroke="black" strokeWidth="40"/>
        <path d="M250 106L250 392" stroke="black" strokeWidth="40"/>
        </svg>
    )

}

function SvgBack() {

    return (
        <svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z"/></svg>
    )

}

function SvgImport() {

    return (
        <svg width="25" height="25" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M129 437L129 201L212 201" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M211 355L129.5 437L48 355" stroke="black" strokeWidth="40"/>
            <ellipse cx="352" cy="87" rx="93" ry="40" stroke="black" strokeWidth="40"/>
            <path d="M445 306C445 323.673 403.362 338 352 338C300.638 338 259 323.673 259 306" stroke="black" strokeWidth="40"/>
            <path d="M445 200C445 217.121 403.362 231 352 231C300.638 231 259 217.121 259 200" stroke="black" strokeWidth="40"/>
            <path d="M259 310V84M445 306.904V84" stroke="black" strokeWidth="40"/>
        </svg>
    ) 

}

function SvgDetails() {

    return ( 
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M117 161H383" stroke="black" strokeWidth="40"/>
            <path d="M117 250H383" stroke="black" strokeWidth="40"/>
            <path d="M117 339H383" stroke="black" strokeWidth="40"/>
        </svg>
    )

}

function SvgDelete() {

    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M156 345L346 155" stroke="black" strokeWidth="40"/>
            <path d="M155 155L345 345" stroke="black" strokeWidth="40"/>
        </svg>
    )

}

function SvgExpand({ display }: { display: boolean }) {

    return(
        <svg width="20" height="20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d={`${display
                    ? "M376 314L250 188L124 314" 
                    : "M376 187L250 313L124 187"
                }`}  
                strokeWidth="50"
            />
        </svg>  
    )

}

function SvgNumero() {
    return(
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200.687 87L164.993 414" stroke="black" strokeWidth="40"/>
            <path d="M334.25 87L298.556 414" stroke="black" strokeWidth="40"/>
            <path d="M415 188L85 188" stroke="black" strokeWidth="40"/>
            <path d="M416 313L86 313" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

function SvgData() {
    return (
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M342 250H250V158" stroke="black" strokeWidth="40"/>
            <circle cx="250" cy="250" r="159" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

function SvgChave() {

    return (
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M429 241.132L223.302 241.132" stroke="black" strokeWidth="40"/>
            <path d="M411.642 354.83L411.642 223.774" stroke="black" strokeWidth="40"/>
            <path d="M334.396 354.83L334.396 223.774" stroke="black" strokeWidth="40"/>
            <circle cx="159.075" cy="248.075" r="78.0755" stroke="black" strokeWidth="40"/>
        </svg>
    )

}

function SvgChaveImport() {
    return (
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M178 390L59 390L59 258" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        <path d="M125 312L203 389.5L125 467" stroke="black" strokeWidth="40"/>
        <path d="M445 118L196.295 117.984" stroke="black" strokeWidth="40"/>
        <path d="M425 222L425 101" stroke="black" strokeWidth="40"/>
        <path d="M343 222L343 101" stroke="black" strokeWidth="40"/>
        <circle cx="131.975" cy="124.975" r="77.975" stroke="black" strokeWidth="40"/>
        <path d="M280.165 367.245C234.232 321.061 326.097 321.061 280.165 274.877L449.694 274.877C495.626 321.061 403.762 321.061 449.694 367.245C495.626 413.429 401.472 415.732 447.659 462.172L278.129 462.172C231.942 415.732 326.097 413.429 280.165 367.245Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        <line x1="318" y1="335" x2="392" y2="335" stroke="black" strokeWidth="40"/>
        <line x1="336" y1="394" x2="410" y2="394" stroke="black" strokeWidth="40"/>
        </svg>

    )
}

function SvgXmlImport() {
    return(
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M178 390L59 390L59 258" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M125 312L203 389.5L125 467" stroke="black" strokeWidth="40"/>
            <path d="M280.165 367.245C234.233 321.061 326.097 321.061 280.165 274.877L449.694 274.877C495.627 321.061 403.762 321.061 449.694 367.245C495.627 413.429 401.472 415.732 447.659 462.172L278.129 462.172C231.942 415.732 326.097 413.429 280.165 367.245Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <line x1="318" y1="335" x2="392" y2="335" stroke="black" strokeWidth="40"/>
            <line x1="336" y1="394" x2="410" y2="394" stroke="black" strokeWidth="40"/>
            <path d="M350.503 40L438.065 127L350.503 214" stroke="black" strokeWidth="40"/>
            <path d="M149.561 40L62 127L149.561 214" stroke="black" strokeWidth="40"/>
            <path d="M192.219 198.284L316.826 73.6774" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

function SvgSucesso() {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M149 219.875L240.063 310.938L348 203" stroke="black" strokeWidth="40"/>
            <circle cx="250.5" cy="249.5" r="184.5" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

function SvgAviso() {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" strokeWidth="40" strokeLinejoin="bevel"/>
            <path d="M250 198V380" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

function SvgError() {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M146 148L351 353" stroke="black" strokeWidth="40"/>
            <path d="M351 148L146 353" stroke="black" strokeWidth="40"/>
            <rect x="66" y="65" width="369" height="369" rx="49" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

function SvgCheck() {

    return (
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M109 195.499L238.501 325L392 171.501" stroke="black" strokeWidth="40"/>
        </svg>
    )

}

function SvgDocumentImport() {
    return (
        <svg width="500" height="501" viewBox="0 0 500 501" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M122.833 195.074C53.6749 125.537 191.99 125.537 122.833 56L378.085 56C447.242 125.537 308.927 125.537 378.085 195.074C447.242 264.611 305.479 268.078 375.02 338L119.767 338C50.2266 268.078 191.99 264.611 122.833 195.074Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        <line x1="177.951" y1="123.122" x2="314.748" y2="123.122" stroke="black" strokeWidth="40"/>
        <line x1="190.943" y1="198.016" x2="327.74" y2="198.016" stroke="black" strokeWidth="40"/>
        <rect x="196" y="218" width="107" height="194" fill="#D9D9D9"/>
        <path d="M249 461L250.005 255" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        <path d="M319 401L249 472L179 401" stroke="black" strokeWidth="40"/>
        </svg>

    )
}

function SvgDocumentManual() {
    return (
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M74.8326 304.074C5.67492 234.537 143.99 234.537 74.8326 165L330.085 165C399.242 234.537 260.927 234.537 330.085 304.074C399.242 373.611 257.479 377.078 327.02 447L71.7675 447C2.22664 377.078 143.99 373.611 74.8326 304.074Z" stroke="black" stroke-width="40" stroke-linejoin="round"/>
        <line x1="129.951" y1="232.122" x2="266.748" y2="232.122" stroke="black" stroke-width="40"/>
        <line x1="142.943" y1="307.016" x2="279.74" y2="307.016" stroke="black" stroke-width="40"/>
        <line x1="124.602" y1="378.854" x2="261.398" y2="378.854" stroke="black" stroke-width="40"/>
        <path d="M406.245 56L211 251.38V307H264.95L461 110.814L406.245 56Z" fill="#D9D9D9" stroke="black" stroke-width="40"/>
        <path d="M406.245 56L211 251.38V307H264.95L461 110.814L406.245 56Z" stroke="black" stroke-width="40"/>
        </svg>
    )
}

export interface SvgUtilItems extends 
    Record<keyof FatoresContext, React.ReactNode>, 
    Record<keyof Omit<ProdutoCadastro, 'fatores' | 'id' >, React.ReactNode> {
    produto: React.ReactNode
    produto3D: React.ReactNode
    plus: React.ReactNode
    back: React.ReactNode
    import: React.ReactNode
    detail: React.ReactNode
    delete: React.ReactNode
    expand: (display: boolean) => React.ReactNode
    numero: React.ReactNode
    data: React.ReactNode
    chave: React.ReactNode
    chaveImport: React.ReactNode
    xmlImport: React.ReactNode
    sucesso: React.ReactNode
    aviso: React.ReactNode
    error: React.ReactNode
    check: React.ReactNode
    documentImport: React.ReactNode
    documentManual: React.ReactNode
    fornecedor: React.ReactNode
}

export const svgsUtil: SvgUtilItems = {
    base: <SvgDefault />,
    fatorBaseNormal: <SvgDefault />,
    fatorBaseST: <SvgDefault />,
    transporte: <SvgFornecedor />,
    st: <SvgST />,
    ipi: <SvgIPI />,
    desconto: <SvgDesconto />,
    codigo: <SvgCodigo />,
    ncm: <SvgNCM />,
    unitario: <SvgDefault />,
    unitarioNota: <SvgUnitarioNota />,
    composto: <SvgComposto />,

    produto: <SvgProduto/>,
    produto3D: <SvgProduto_3D/>,
    plus: <SvgPlus />,
    back: <SvgBack />,
    import: <SvgImport />,
    detail: <SvgDetails />,
    delete: <SvgDelete />,
    expand: (display: boolean) => <SvgExpand display={display} />,
    numero: <SvgNumero />,
    data: <SvgData />,
    chave: <SvgChave />,
    chaveImport: <SvgChaveImport />,
    xmlImport: <SvgXmlImport />,
    sucesso: <SvgSucesso />,
    aviso: <SvgAviso />,
    error: <SvgError />,
    check: <SvgCheck />,
    documentImport: <SvgDocumentImport />,
    documentManual: <SvgDocumentManual />,
    fornecedor: <SvgFornecedor />,
}