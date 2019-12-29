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
                <h1>This is a visualization of all the protests against Citizenship Ammendment Act (CAA) across India</h1>
                <motion.button 
                    className="primary_btn"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale:0.9}}
                    onClick = {()=> {
                        controls.start(close)
                        contentControls.start({opacity: 0, transition: {duration: 0.1}})
                    }}
                >Go
                </motion.button>
            </motion.div>
        </motion.div>
    )
}