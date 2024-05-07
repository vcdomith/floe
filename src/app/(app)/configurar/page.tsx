import { FormEvent } from "react"
import CheckBox from "./(CheckBox)/CheckBox"
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor"

export default function Configurar() {

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()


    }

    return (
        <div
            style={{
                width: '100vw',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <p
                style={{
                    fontSize: '1.5rem',

                }}
            >Em breve...</p>
            <form 
                // onSubmit={(e) => handleSubmit(e)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    border: '2px solid',
                }}
            >
                <span>
                    <p>Fornecedor</p>
                    {/* <input type="text" required/> */}
                    {/* <select name="" id="" defaultValue='Selecione um fornecedor' required>
                        <option value="mileno">Mileno</option>
                        <option value="denlex">Denlex</option>
                    </select> */}
                    <SelectFornecedor />
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>ST?</p>
                    <CheckBox />
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>IPI?</p>
                    <CheckBox />
                </span>
                <button type="submit">Enviar</button>
                {/* <input type="submit" hidden/> */}
            </form>
        </div>
    )

}