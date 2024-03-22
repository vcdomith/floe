import { animated, useSpring } from "@react-spring/web"
import { useState } from "react"

const Path = () => {

    const [length, setLength] = useState<null | number>(null)
    // const config = { tension: 600, friction: 0, mass: 500, precision: 0.1 }
    const config = { tension: 300, friction: 200, mass: 5, damping: 1, precision: 0.1 }

    const animation = useSpring({
        from: { stroke: '#591c4a10' , strokeDasharray: length, strokeDashoffset: length },
        to: { stroke: '#591C4A', strokeDasharray: length, strokeDashoffset: 0 },
        config: config
    })

    return (
        <animated.path 
            style={animation as any}
            ref={(ref) => {
                if(ref) setLength(ref.getTotalLength())
            }}
            // d="M55 187.5C77 104.5 92 53 256 53C420 53 461.5 253 380.5 227C299.5 201 126.5 138.5 126.5 274C126.5 334 376 249 376 320.5C376 402.684 250.5 346.5 250.5 391" 
            d="M24 170C97.5 -72 516 39.5 474.5 212.5C435.894 373.434 125.074 196.773 125.074 196.773C230.179 253.505 289.107 285.312 394.212 342.043C394.212 342.043 249.5 317.5 249.5 449"
            stroke="black" 
            strokeWidth="40"
        />
    )
}

const NoMatch = () => {

    const animation = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        delay: 3000,
    })

    return (
        <svg style={{ minWidth: '75px' }} width="75" height="75" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path />
        {/* <path d="M273 427.5C273 439.926 262.926 450 250.5 450C238.074 450 228 439.926 228 427.5C228 415.074 238.074 405 250.5 405C262.926 405 273 415.074 273 427.5Z" fill="black"/> */}
        <circle style={{ zIndex: 1 }} cx="250" cy="250" r="200" fill="url(#paint0_radial_3_31)"/>
        <circle cx="250" cy="250" r="69" fill="url(#paint0_linear_16_5)"/>
        <animated.circle style={animation} cx="250" cy="464" r="21" fill="#591C4A"/>
        <defs>
        <linearGradient id="paint0_linear_16_5" x1="291.5" y1="181" x2="207" y2="319" gradientUnits="userSpaceOnUse">
        <stop stop-color="#E8D4B0"/>
        <stop offset="1" stop-color="#591C4A" stop-opacity="0.86"/>
        </linearGradient>
        <radialGradient id="paint0_radial_3_31" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(249.799 250.5) rotate(126.557) scale(157.482)">
            <stop stop-color="#E8D4B0" stop-opacity="0"/>
            <stop offset="0.4359" stop-color="#E8D4B0" stop-opacity="0"/>
            <stop offset="0.436" stop-color="#E8D4B0"/>
            <stop offset="1" stop-color="#E8D4B0" stop-opacity="0"/>
            </radialGradient>
        </defs>
        </svg>

    )
}

export default NoMatch