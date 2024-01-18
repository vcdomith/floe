import styles from './NumberInput.module.css'

interface NumberInputProps {

    label: string
    placeholder: string
    valor: number | ''
    setValor: (valor: number | '') => void

}

const NumberInput = ({ label, placeholder, valor, setValor }: NumberInputProps) => {
  return (
    <div className={styles.container}>
        <label className={styles.label}>{label}</label>
        <input 
            className={styles.input}
            type="number" 
            step={0.01}
            placeholder={placeholder}
            value={valor}
            onChange={evento => {
              evento.target.value !== ''
                ? setValor(parseFloat(evento.target.value))
                : setValor('')
            }
          }
        />
    </div>
  )
}

export default NumberInput

