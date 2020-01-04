import React, {useState, useEffect, useRef} from 'react'
import {motion, useAnimation} from 'framer-motion'
import { Event } from "./Tracking";
import chevron_primary from '../icons/chevron-primary.svg'
import chevron_white from '../icons/chevron-white.svg'
import fist from '../icons/fist.svg'

export function SubmitForm(props) {
    const {desktopSize, selectedCity, onNewLinkSubmit} = props
    const [isOpen, setIsOpen] = useState(window.innerWidth > desktopSize);
    const [isThankYou, setIsThankYou] = useState(false);
    const linkEl = useRef(null);
    const cityEl = useRef(null);
    const containerControls = useAnimation();
    const closeButtonControls = useAnimation();
    const chevronControls = useAnimation();
    const toggleButtonLabelControls = useAnimation();

    const container_variants = {"open": {height: 470, top: `calc(var(--vh, 1vh) * 100 - 470px)`},"close": {height: 50, top: `calc(var(--vh, 1vh) * 100 - 50px)`}}
    const closeButton_variants = {"open": {backgroundColor: '#1f2532'},"close": {backgroundColor: (window.innerWidth < desktopSize ? '#2d3142' : '#FF5853')}}
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

    const handleCloseToggle = () => {
        setIsOpen(!isOpen)
        !isOpen && Event("UserAction", "Opened submit link form", window.innerWidth > desktopSize ? "DESKTOP": "MOBILE")
        !isOpen && setIsThankYou(false)
        chevronControls.start({scale: 1})
    } 

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
            drag="y"
            dragConstraints={{top: 0, bottom:0}}
            dragMomentum={false}
            onDragEnd={(e, info) => {if((info.point.y > 10 && isOpen) || (info.point.y < -10 && !isOpen)) {handleCloseToggle()}}}
        >
            <motion.button 
                className="toggleCloseButton"
                variants = {closeButton_variants}
                initial = {isOpen? "open" : "close"} 
                animate = {closeButtonControls}
                onHoverStart = {() => chevronControls.start({scale: 1.3})}
                onHoverEnd = {() => chevronControls.start({scale: 1})}
                onClick={() => {
                    handleCloseToggle();
                }}
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
            {!isThankYou &&
                <motion.div 
                    className="submitFormBody"
                >
                    <h2>Add more protest videos to the map</h2>
                    <p>This is our chance to visualize India's response to CAA. Videos will be manually reviewed before being added</p>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault()
                            onNewLinkSubmit({
                                "link": linkEl.current.value,
                                "city": cityEl.current.value
                            })
                            linkEl.current.value = '';
                            cityEl.current.value = '';
                            setIsThankYou(true);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <label htmlFor="form_link" className="field">
                            <span className="form_label">Link:</span>
                            <input required id="form_link" type="url" ref={linkEl} placeholder="https://twitter.com/..."/>
                        </label>
                        <label htmlFor="form_city" className="field">
                            <span className="form_label">City:</span>
                            <input required id="form_city" type="text" ref={cityEl} placeholder="Where is the protest happening"/>
                        </label>
                        <motion.button
                            type= "submit"
                            className = "primary_btn submitButton" 
                            whileHover = {{scale: 1.02}}
                            whileTap = {{scale: 0.98}}
                        >
                            Submit for review
                        </motion.button>
                    </form>
                    {/* <p className="sendVideoMessage">Want to send us the video instead, our WhatApp is open at +91-xxx-xxx-xxxx</p> */}
                </motion.div>
            }
            {isThankYou && 
                <div className="thankYouBody">
                    <h1>You are a rockstar!</h1>
                    <p>We appreciate your contribution. We will review the link you submitted and add it to the map as soon as we can</p>
                    <motion.button 
                        onClick={() => handleCloseToggle()}
                        whileHover = {{scale: 1.02}}
                        whileTap = {{scale: 0.98}}
                        className= "primary_btn doneButton"
                    >OK
                    </motion.button>
                    <motion.img 
                        src={fist}
                        initial = {{y:0}}
                        animate = {{y:10}}
                        transition = {{
                            yoyo: 'Infinity',
                            ease: 'easeInOut'
                        }}
                    />
                </div>
            }
            
        </motion.div>
    )
}