'use client'
import { dbConnect } from "@/utils/db/supabase"

export default function CalcularXML() {

    const supabase = dbConnect()

    const handleClick = async () => {

        const { data: lastNsu, error: lastNsuError } = await supabase
            .from('nfes')
            .select('*')
            .order('nsu', { ascending: false })
            .limit(1)
            .single()

        if (lastNsuError) console.log(lastNsuError); 
        console.log(lastNsu);   
    }


    return <div>
        XML
        <button onClick={ () => handleClick() }>nfe</button>
        </div>

}