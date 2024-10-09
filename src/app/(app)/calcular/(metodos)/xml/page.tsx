'use client'
import { dbConnect } from "@/utils/db/supabase"
import ImportarChaveSection from "../chave/ImportarChaveSection/ImportarChaveSection"

export default function CalcularXML() {

    // const supabase = dbConnect()

    // const handleClick = async () => {

    //     const { data: lastNsu, error: lastNsuError } = await supabase
    //         .from('nfes')
    //         .select('*')
    //         .order('nsu', { ascending: false })
    //         .limit(1)
    //         .single()

    //     if (lastNsuError) console.log(lastNsuError); 
    //     console.log(lastNsu);   
    // }


    return <ImportarChaveSection tipo="xml" />


}