import CheckBox from "./(CheckBox)/CheckBox"
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"

export default function Configurar() {

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
        </div>
    )

}