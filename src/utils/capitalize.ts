
export default function capitalize(string: string):string {

    const captalizedFirstLetter = string[0].toUpperCase()
    const lowercasePart = string.slice(1,)
    return `${captalizedFirstLetter + lowercasePart}`

}