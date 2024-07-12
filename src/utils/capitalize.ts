
export default function capitalize<T extends string>(string: T): T {

    if (typeof string !== 'string') return string as T
    
    const captalizedFirstLetter = string[0].toUpperCase()
    const lowercasePart = string.slice(1,)
    return `${captalizedFirstLetter + lowercasePart}` as T

}