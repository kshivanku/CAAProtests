import React, {useEffect} from 'react';
import {motion, useAnimation} from 'framer-motion'
import {PageView} from './Tracking';

export function IntroScreen(props) {
    const {selectedCity} = props;
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
                <h1>Law Makers, Law Breakers</h1>
                <p> India has been on the streets this winter to save the secular fabric of the 
                    nation by strongly opposing the Citizenship Amendment Act (CAA) and National 
                    Register of Citizens (NRC). Over 20 civilians have died since these protests 
                    began early in December 2019.<span style={{fontWeight: "bold"}}> This map depicts protests from across the country. </span> 
                    While protests held in some parts of the country were peaceful, others were met 
                    with a violent and brutal response from those armed with power and ammunition, 
                    causing serious damage to life, property and morale of the citizens.
                </p>
                <motion.button 
                    className="primary_btn"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale:0.9}}
                    onClick = {()=> {
                        selectedCity ? PageView(selectedCity) : PageView('Homepage')
                        controls.start(close)
                        contentControls.start({opacity: 0, transition: {duration: 0.1}})
                    }}
                >View the map
                </motion.button>
            </motion.div>
        </motion.div>
    )
}