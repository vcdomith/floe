import { SetStateAction } from "react"
import CheckBox from "../(CheckBox)/CheckBox"

import style from './Config.module.scss'

interface ConfigProps {

    svg: React.ReactNode
    title: string
    description: string

    checked: boolean
    setChecked: (checked: SetStateAction<boolean>) => void

}

const Config = ({svg, title, description, checked, setChecked}: ConfigProps) => {

  return (
    <span className={style.config}>
        <span className={style.info}>
            {svg}
            <div className={style.texts}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </span>
        <CheckBox checked={checked} setChecked={setChecked} />
    </span>
  )

}

export default Config