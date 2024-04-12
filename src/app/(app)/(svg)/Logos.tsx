import style from './Logos.module.scss'

function SvgCadastros() {

    return (
        <svg 
            className={style.logo}
            width="75" height="75" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M0 480.001C249.5 480.001 0 359 249.5 359" stroke="#591C4A" stroke-width="40"/>
            <path d="M250 480.001C499.5 480.001 250 359 499.5 359" stroke="#591C4A" stroke-width="40"/>
            <path d="M0 141C249.5 141 0 20 249.5 20" stroke="#591C4A" stroke-width="40"/>
            <path d="M250 141C499.5 141 250 20 499.5 20" stroke="#591C4A" stroke-width="40"/>
            <path d="M0 302C249.5 302 0 181 249.5 181" stroke="#591C4A" stroke-width="40"/>
            <path d="M250 319.5C499.5 319.5 250 181 499.5 181" stroke="#591C4A" stroke-width="40"/>
            <circle cx="250" cy="250" r="69" stroke="#591C4A" stroke-width="40"/>
        </svg>
    )

}

function SvgConfigurar() {

    return (
        <svg 
            className={style.logo}
            width="75" height="75" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="250" cy="247" r="125" stroke="#591C4A" stroke-width="40"/>
            <path d="M0.5 271C97.5 271 61.8621 20.9999 205 21C258.5 21 250 70 250 129" stroke="#591C4A" stroke-width="40"/>
            <path d="M499.994 230C402.994 230 438.632 480 295.494 480C241.994 480 250.494 431 250.494 372" stroke="#591C4A" stroke-width="40"/>
            <path d="M249.969 140C249.969 177 214 187.5 214 225.5C214 269.434 296.165 223.104 298 267C299.317 298.507 249.969 315 249.969 355.448" stroke="white" stroke-width="40"/>
        </svg>
    )

}


function SvgTabela() {

    return (
        <svg 
            className={style.logo}
            width="75" height="75" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 150.278 180.487 198.278 211.82" stroke="#591C4A" stroke-width="40"/>
            <path d="M474.07 98.893C465.57 92.393 350.07 7.89299 305.57 43.893C261.07 79.893 498.57 212.393 474.07 298.893C454.47 368.093 353.57 322.726 305.57 291.393" stroke="#591C4A" stroke-width="40"/>
            <circle cx="250" cy="250" r="69" stroke="#591C4A" stroke-width="40"/>
        </svg>
    )

}

const Logos = {
    SvgCadastros,
    SvgConfigurar,
    SvgTabela,
}

export default Logos
