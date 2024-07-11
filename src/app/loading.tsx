'use client'
import LogoSvg from "@/components/SvgArray/LogoSvg";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Loading() {

    return(
        <AnimatePresence>
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}   
            exit={{ opacity: 0 }}

            style={{
                position: 'fixed',
                backgroundColor: 'green',
                top: 0,
                left: 0,
                width: '100vmax',
                height:' 100vmax',
                transition: 'background-color 600ms ease-out',
            }}
        >
            <LogoSvg loop />
            <h3
                style={{
                    color: "wheat",
                }}
                >Carregando</h3>
        </motion.section>
        </AnimatePresence>
    )

}