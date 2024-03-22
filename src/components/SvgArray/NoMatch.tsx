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
            d="M55.5 173C118.5 35.5 370 34 426 184C473.362 310.863 141 204.5 141 204.5L360 322.5C360 322.5 230.5 318.5 230.5 424"
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
        <svg width="75" height="75" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path />
        {/* <path d="M273 427.5C273 439.926 262.926 450 250.5 450C238.074 450 228 439.926 228 427.5C228 415.074 238.074 405 250.5 405C262.926 405 273 415.074 273 427.5Z" fill="black"/> */}
        <circle cx="250" cy="250" r="69" fill="url(#paint0_linear_16_5)"/>
        <animated.circle style={animation} cx="225" cy="470" r="25" fill="#591C4A"/>
        <defs>
        <linearGradient id="paint0_linear_16_5" x1="291.5" y1="181" x2="207" y2="319" gradientUnits="userSpaceOnUse">
        <stop stop-color="#E8D4B0"/>
        <stop offset="1" stop-color="#591C4A" stop-opacity="0.86"/>
        </linearGradient>
        </defs>
        </svg>

    )
}

export default NoMatch