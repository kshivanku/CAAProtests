import React from 'react';
import {motion, useAnimation} from 'framer-motion'

export function IntroScreen() {
    const controls = useAnimation();
    const contentControls = useAnimation();
    const close = {height: 0, transition: {ease: "easeInOut", duration: 1}}
    return (
        <motion.div
            className="introScreenContainer"
            animate={controls}
        >
            <motion.div
                className="introScreenContent"
                animate={contentControls}
            >
                <h1>India has been on the streets this winter to save the secular fabric of the country</h1>
                <h2>Over 20 civilians have died since these protests began on 20th of December 2019. Here is a map of the protests across the country.</h2>
                <motion.button
                    className="primary_btn"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale:0.9}}
                    onClick = {()=> {
                        controls.start(close)
                        contentControls.start({opacity: 0, transition: {duration: 0.1}})
                    }}
                >Enter
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
