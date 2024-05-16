
import { dbConnect } from "@/utils/db/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { RefObject, SetStateAction, Suspense, cache } from "react"

interface ListaFornecedoresProps {

    fornecedores: string[]

    fornecedoresRef: RefObject<HTMLUListElement>
    selectRef: RefObject<HTMLButtonElement>

    display: boolean
    setDisplay: (value: boolean) => void

    setFornecedor: (value: string) => void

    selectIndex: number

    style: { readonly [key: string]: string; }

}

// const getFornecedores = cache(async () => {

//     const supabase = dbConnect()

//     try {
        
//         const { data: fornecedores, error } = await supabase.from('fornecedores').select('nome')
//         return fornecedores

//     } catch (error) {
//         console.error(error);
//     }


// })

const ListaFornecedores = ({ fornecedores, fornecedoresRef, selectRef, display, setDisplay, setFornecedor, selectIndex, style }: ListaFornecedoresProps) => {

    // const fornecedoresDB: ({nome: string}[] | null) = await getFornecedores()
    // const fornecedores = fornecedoresDB?.map(item => item.nome)

    return (
        // <div>{JSON.stringify(fornecedores)}</div>
        // <div>
        //     {fornecedores?.map(fornecedor => 
        //         <p key={fornecedor}>{fornecedor}</p>
        //     )}
        // </div>
        <ul
            ref={fornecedoresRef}
            className={style.list}
            tabIndex={-1}
            data-display={display}
        >
        <AnimatePresence initial={false} mode="popLayout">
            <Suspense>
              
        {(
            (fornecedores.length > 0)
            ?
                fornecedores.map((fornecedor, index) => 
                <motion.li 
                    initial={{ opacity: 0 , x: -20}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 20}}

                    key={fornecedor}
                    className={style.fornecedor}
                    data-selected={selectIndex === index}
                    tabIndex={-1}
                    onClick={() => {
                        setFornecedor(fornecedor)
                        setDisplay(false)
                        selectRef.current?.focus()
                    }}
                >{fornecedor}</motion.li>
                )
            :
                <motion.li
                initial={{ opacity: 0 , x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}

                className={style.noMatch}
                >   
                    <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 150.278 180.487 198.278 211.82" stroke="#591C4A" strokeWidth="40" stroke-dasharray="40 20"/>
                        <path d="M474.07 98.893C465.57 92.393 350.07 7.89299 305.57 43.893C261.07 79.893 498.57 212.393 474.07 298.893C454.47 368.093 353.57 322.726 305.57 291.393" stroke="#591C4A" strokeWidth="40" stroke-dasharray="40 20"/>
                        <circle style={{ zIndex: 1 }} cx="250" cy="250" r="200" fill="url(#paint0_radial_3_31)"/>
                        <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
                        <defs>
                            <radialGradient id="paint0_radial_3_31" cx="0" cy="0" r="1.2" gradientUnits="userSpaceOnUse" gradientTransform="translate(249.799 250.5) rotate(126.557) scale(157.482)">
                                <stop stopColor="#E8D4B0" stopOpacity="0"/>
                                <stop offset="0.4359" stopColor="#E8D4B0" stopOpacity="0"/>
                                <stop offset="0.436" stopColor="#E8D4B0"/>
                                <stop offset="1" stopColor="#E8D4B0" stopOpacity="0"/>
                            </radialGradient>
                        </defs>
                    </svg>
                    <p>Nenhuma correspondência encontrada</p>
                </motion.li>
        )
        }  
        </Suspense>  
        </AnimatePresence>
        </ul> 

    )

}

export default ListaFornecedores