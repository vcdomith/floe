
export default function isEqual(value1: any, value2: any): boolean {

    if (typeof value1 !== 'object' && typeof value2 !== 'object') 
        return Object.is(value1, value2)
    

    if (value1 === null && value2 === null) {
        return true
    } 
    
    if (typeof value1 !== typeof value2) {
        return false
    }
    
    if (value1 === value2!) {
        return true
    }
    
    if (Array.isArray(value1) && Array.isArray(value2)) {

        if (value1.length !== value2.length) {
            return false
        }

        for (let i = 0; i < value1.length; i++) {

            if (!isEqual(value1[i], value2[i])) {
                return false
            }
            
        }

        return true

    }

    if (Array.isArray(value1) || Array.isArray(value2)) {
        return false
    }

    if (Object.keys(value1 as object).length !== Object.keys(value2 as object).length) {
        return false;
    }

    for (const [k, v] of Object.entries(value1 as object)) {
       
        if (!(k in (value2 as object))) {
            return false;
        }
    
        if (!isEqual(v, (value2)[k])) {
            return false;
        }
    }

    return true

}