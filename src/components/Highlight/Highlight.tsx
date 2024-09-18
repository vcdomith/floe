
import style from './Highlight.module.scss'

export default function Highlight({ children }: { children: React.ReactNode }) {
    
    return (
        <strong className={style.highlight}>
            {/* <ShineSVG />
            <ShineSVG />
            <ShineSVG /> */}
            {children}
        </strong>
    )

}


function ShineSVG() {

    return (
        <svg width="10" height="10" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M255 99C255 147.333 223.8 244.2 99 245C147.333 245 244.2 276.2 245 401C245 352.667 276.2 255.8 401 255C352.667 255 255.8 223.8 255 99Z" fill="black"/>
        </svg>

    )

}