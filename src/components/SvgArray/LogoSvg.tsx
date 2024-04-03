import React, { useEffect, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'

import './svgColorMap.scss'
import svg from './LogoSvg.module.scss'

interface SvgProps {

    loop?: boolean
    corPrimaria?: string
    corSecundaria?: string

}
const Path = ({ loop }: SvgProps) => {

    const [length, setLength] = useState<null | number>(null)
    const config = loop 
    ? { tension: 600, friction: 0, mass: 500, precision: 0.1 }
    : { tension: 200, friction: 200, mass: 10, damping: 1, precision: 0.1 }

    const props = useSpring({
        from: { stroke: 'var(--cor-primaria-transparente)' , strokeDasharray: length, strokeDashoffset: length },
        to: { stroke: 'var(--cor-primaria)', strokeDasharray: length, strokeDashoffset: 0 },
        config: config
    })
    
    return (
        <animated.path 
            style={props as any}
            ref={(ref) => { 
                if(ref) {
                    setLength(ref.getTotalLength()) 
                } 
            }}
            d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 146.5 179.83 198.278 211.82C250.057 243.809 392.5 388 463 320.5C533.5 253 263.5 74.5 305.5 42C347.5 9.49999 444.5 80 463 92.5" stroke="#591C4A" strokeWidth="40"/>
    )
}

const Circle = () => {

    const styles = useSpring({
        from: { r: 100, zIndex: 2 },
        to: [
            { r: 90 },
            { r: 100 }
        ],
        delay: 500,
        config: { tension: 600, friction: 0, mass: 500 },
    })
    
  

    return (
        <animated.circle
        // className={svg.circle} 
        style={styles as any}
        // style={{
        //     transform: styles.y.to((val) => `rotate(${val}deg)`)
        // }}
            cx="250" cy="250" r="100" 
            fill="url(#paint0_linear_3_31)"
            // fill='#E8D4B0'
        />
    )

}

  

const LogoSvg = ({ loop }: SvgProps) => {

    
  return (
    <svg
    // style={{ backgroundColor: '#591C4A' }}
     className={svg.svg}
     width="75" height="75" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" 
    // onClick={() => setToggle(prev => !prev)}
    >
        {/* <rect width="500" height="500" fill="url(#paint0_linear_3_31)"/> */}
        <Path loop={loop ? true : false}
        // toggle={toggle}
         />
        <circle style={{ zIndex: 1 }} cx="250" cy="250" r="200" fill="url(#paint0_radial_3_31)"/>
        <Circle />
        <defs>
            <linearGradient id="paint0_linear_3_31" x1="291.5" y1="181" x2="207" y2="319" gradientUnits="userSpaceOnUse">
                <stop 
                // Color defined in the scss file
                // stopColor="#591C4A"
                />
                <stop 
                    offset="1" 
                    // Color defined in the scss file
                    // stopColor="#E8D4B0" 
                    stopOpacity="0.90"
                />
            </linearGradient>
            <radialGradient id="paint0_radial_3_31" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(249.799 250.5) rotate(126.557) scale(157.482)">
            <stop stopColor="#E8D4B0" stopOpacity="0"/>
            <stop offset="0.4359" stopColor="#E8D4B0" stopOpacity="0"/>
            <stop offset="0.436" stopColor="#E8D4B0"/>
            <stop offset="1" stopColor="#E8D4B0" stopOpacity="0"/>
            </radialGradient>
        </defs>
    </svg>
  )
}

export default LogoSvg