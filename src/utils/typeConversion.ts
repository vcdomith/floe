
const stringToFloat = (valor: string): number => {
    return parseFloat(valor.replace(/,/g, '.'))
  }
  
const floatToString = (valor: number, decimals?: number): string => {
    return valor.toFixed(decimals || 4).replace(/\./g, ',')
  } 

const Converter = {
    stringToFloat,
    floatToString
}

export default Converter