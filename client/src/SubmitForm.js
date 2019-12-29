import React, {useState, useEffect} from 'react'
import {motion, useAnimation, useMotionValue} from 'framer-motion'
import './App.css'
import chevron_primary from './chevron-primary.svg'
import chevron_white from './chevron-white.svg'

export function SubmitForm(props) {
    const {desktopSize, selectedCity} = props
    const [isOpen, setIsOpen] = useState(window.innerWidth > desktopSize);
    const containerControls = useAnimation();
    const closeButtonControls = useAnimation();
    const chevronControls = useAnimation();
    const toggleButtonLabelControls = useAnimation();

    const container_variants = {"open": {height: 500, top: `calc(var(--vh, 1vh) * 100 - 500px)`},"close": {height: 50, top: `calc(var(--vh, 1vh) * 100 - 50px)`}}
    const closeButton_variants = {"open": {backgroundColor: '#000'},"close": {backgroundColor: '#ff3c0a'}}
    const chevron_variants = {"open": {rotate: 0}, "close": {rotate: 180}}
    const toggleButton_variants = {"open": {opacity: 0}, "close": {opacity: 1}}

    useEffect(()=>{
        if(isOpen) {
            setIsOpen(selectedCity === null)
        }
    }, [selectedCity])

    containerControls.start(container_variants[isOpen ? "open": "close"])
    closeButtonControls.start(closeButton_variants[isOpen ? "open": "close"])
    chevronControls.start(chevron_variants[isOpen ? "open": "close"])
    toggleButtonLabelControls.start(toggleButton_variants[isOpen ? "open": "close"])

    return(
        <motion.div 
            className="submitFormContainer"
            variants = {container_variants}
            initial = {isOpen? "open" : "close"}
            animate = {containerControls}
            transition = {{
                type: 'spring',
                damping: 16
            }}
        >
            <motion.button 
                className="toggleCloseButton"
                variants = {closeButton_variants}
                initial = {isOpen? "open" : "close"} 
                animate = {closeButtonControls}
                onClick={() => {setIsOpen(!isOpen)}}
            >
                <motion.img 
                    src={isOpen ? chevron_primary : chevron_white} 
                    alt="toggle submit form button" 
                    variants = {chevron_variants}
                    initial = {isOpen? "open" : "close"} 
                    animate={chevronControls}
                />
                <motion.p 
                    variants= {toggleButton_variants} 
                    initial = {isOpen ? "open" : "close"} 
                    animate={toggleButtonLabelControls}
                >Add more protest videos to the map</motion.p>
            </motion.button>

            <motion.div 
                className="submitFormBody"
            >
                <h2>Add more protest videos to the map</h2>
                <p>This is our chance to visualize India's response to CAA. Videos will be manually reviewed before being added</p>
                <form action="">
                    <label htmlFor="form_link" className="field">
                        <span className="form_label">Link:</span>
                        <input id="form_link" type="text" placeholder="https://twitter.com/..."/>
                    </label>
                    <label htmlFor="form_city" className="field">
                        <span className="form_label">City:</span>
                        <input id="form_city" type="text" placeholder="Where is the protest happening"/>
                    </label>
                    <motion.button
                        className = "submitButton" 
                        onClick={e => e.preventDefault()}
                        whileHover = {{scale: 1.02}}
                        whileTap = {{scale: 0.98}}
                    >
                        Submit for review
                    </motion.button>
                </form>
                <p className="sendVideoMessage">Want to send us the video instead, our WhatApp is open at +91-xxx-xxx-xxxx</p>
            </motion.div>
        </motion.div>
    )
}