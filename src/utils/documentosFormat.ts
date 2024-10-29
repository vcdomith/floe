export function chaveFormatSplit(chave: string) {
    if (chave.length !== 44) return
    return chave.match(/.{1,4}/g)
}

export function cnpjFormatSplit(cnpj: string) {
    if (cnpj.length !== 14) return
    return cnpj.match(/^.{2}.{3}.{3}.{4}.{2}$/g)
}

export function formatSplit(string: string, format: number[]) {

    const formatLengthSum = format.reduce((acc, n) => acc + n, 0)

    if (string.length !== formatLengthSum) {
        console.log(`To format string both the string length: ${string.length} and format array sum: ${formatLengthSum} must be the same `);
        return
    }

    let prevRange = 0
    const result = format.map( len => {
        const slice = string.slice(prevRange, prevRange+len)
        prevRange += len
        return slice
    } )

    return result

}