import { SetStateAction } from "react"
import CheckBox from "../(CheckBox)/CheckBox"

import style from './Config.module.scss'

interface ConfigProps {

    svg: React.ReactNode
    title: string
    description: string

    // checked: boolean
    // setChecked: (checked: SetStateAction<boolean>) => void

    input: React.ReactNode

}

const Config = ({svg, title, description, input}: ConfigProps) => {

  return (
    <span className={style.config}>
        <span className={style.info}>
            {svg}
            <div className={style.texts}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </span>
        {/* <CheckBox checked={checked} setChecked={setChecked} /> */}
        {input}
    </span>
  )

}

export default Config