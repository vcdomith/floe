import React, { useEffect, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'

const Path = () => {

    const [length, setLength] = useState<null | number>(null)

    const props = useSpring({
        // strokeDasharray: length,
        // strokeDashoffset: toggle ? length : 0,
        from: { stroke: '#591c4ab', strokeDasharray: length, strokeDashoffset: length, d: '' },
        to: { stroke: '#591C4A', strokeDasharray: length, strokeDashoffset: 0 },
        config: {
            tension: 200,
            friction: 200,
            mass: 10,
            damping: 1,
            precision: 0.1,
        }
        // Com essas configs existe um loop
        // config: {
        //     tension: 300,                  
        //     friction: 1,
        //     mass: 500,                  
        //     precision: 0.1,
        //   },
    })
    
    return (
        <animated.path 
            style={props as any}
            ref={(ref) => { 
                if(ref) {
                    console.log(ref.getTotalLength());
                    setLength(ref.getTotalLength()) 
                } 
            }}
            d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 146.5 179.83 198.278 211.82C250.057 243.809 392.5 388 463 320.5C533.5 253 263.5 74.5 305.5 42C347.5 9.49999 444.5 80 463 92.5" stroke="#591c4a" stroke-width="20"/>
    )
}

const Circle = () => {

    const animation = useSpring({
        from: { y: 0 },
        to: { y: 20 },
        config: { duration: 2000 , easing: t => Math.sin(t * Math.PI * 2) }, // Using sinewave easing
        reset: true, // Reset animation to 'from' value when it reaches 'to' value
    });

    return (
        <animated.circle style={animation} cx="250" cy="250" r="75" fill="url(#paint0_linear_3_31)"/>
    )

}

  

const LogoSvg = () => {

    
  return (
    <svg width="100" height="100" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" 
    // onClick={() => setToggle(prev => !prev)}
    >
        <Path 
        // toggle={toggle}
         />
        <Circle />
        <defs>
            <linearGradient id="paint0_linear_3_31" x1="291.5" y1="181" x2="207" y2="319" gradientUnits="userSpaceOnUse">
                <stop stop-color="#591C4A"/>
                <stop offset="1" stop-color="#E8D4B0" stop-opacity="0.90"/>
            </linearGradient>
        </defs>
    </svg>
  )
}

export default LogoSvg