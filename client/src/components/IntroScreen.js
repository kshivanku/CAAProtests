import React, {useEffect} from 'react';
import {motion, useAnimation} from 'framer-motion'

export function IntroScreen() {
    const controls = useAnimation();
    const contentControls = useAnimation();
    const close = {height: 0, transition: {ease: "easeInOut", duration: 1}}

    useEffect(()=>{
        contentControls.start({y: 0, opacity: 1, transition: {ease: 'easeInOut'}})
    },[])
    return (
        <motion.div
            className="introScreenContainer"
            animate={controls}
        >
            <motion.div 
                className="introScreenContent"
                initial = {{y: 10, opacity: 0}}
                animate={contentControls}
            >
                <h1>This is a visualization of all the protests against Citizenship Amendment Act (CAA) across India</h1>
                <motion.button 
                    className="primary_btn"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale:0.9}}
                    onClick = {()=> {
                        controls.start(close)
                        contentControls.start({opacity: 0, transition: {duration: 0.1}})
                    }}
                >Lets go!
                </motion.button>
            </motion.div>
        </motion.div>
    )
}