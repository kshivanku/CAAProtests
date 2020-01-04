import React, {useEffect, useRef} from 'react'
import {motion, AnimatePresence, useMotionValue} from 'framer-motion'
import close from '../icons/close.svg'
import githublogo from '../icons/github.svg'
import twitterlogo from '../icons/twitterlogo.svg'
import {Event} from "./Tracking"

export function About(props) {
    let {handleAboutClose, desktopSize} = props
    let containerVariants = {
        open: {opacity: 1, transition: {type: 'spring', damping: 16, staggerChildren: 0.2}},
        close: {opacity: 0, transition: {ease: 'easeOut', duration: 1}}
    }
    let contentVariants = {
        open: {opacity: 1, y: 0},
        close: {opacity: 0, y: 50}
    }
    let scrollValue = useMotionValue(0);
    let touchStart = 0;
    let touchEnd = 0;
    const aboutContent = useRef(null);
    useEffect(()=> {
        aboutContent.current.addEventListener('touchstart', function(e){touchStart=e.changedTouches[0].clientY})
        aboutContent.current.addEventListener('touchend', function(e) {
            touchEnd = e.changedTouches[0].clientY;
            if(scrollValue.get() <= 0 && touchEnd > touchStart) {
                touchStart = 0;
                touchEnd = 0;
                handleAboutClose();
            }
        });
    }, [])

    return(
        <AnimatePresence>
            <motion.div 
                className = "aboutContainer"
                variants = {containerVariants}
                initial = "close"
                animate = "open"
                exit= "close"
            >
                <motion.div
                    className = "aboutBGscreen"
                    variants = {containerVariants}
                    onClick = {() => handleAboutClose()}
                />   
                <motion.div
                    className = "aboutContent"
                    variants = {contentVariants}
                    ref = {aboutContent}
                    onScroll = {(e) => {scrollValue.set(e.nativeEvent.target.scrollTop)}}
                >
                    <div className="aboutContentHeader">
                        <h1>Law Makers, Law Breakers</h1>
                        <button className="close_btn" onClick={() => handleAboutClose()}><img src={close}  alt="close button" /></button>
                    </div>
                    <div className="aboutContentBody">
                        <p>
                            <span style={{fontWeight: "bold"}}>Law Makers, Law Breakers </span> 
                            is a citizen led project that aims to objectively document field evidence of democratic protest against the state 
                            and the state’s response to it.Genuine submissions of unedited videos, photos and objective reporting documenting 
                            the protests in India and the world against the CAA and NRC are solicited from the public and curated as per the&nbsp;  
                            <a className="link" href="https://github.com/kshivanku/CAAProtests/wiki/Content-policy">content policy</a>. 
                        </p>
                        <a href="https://twitter.com/mycountryawake" className="aboutCardContainer" target="_blank" onClick={()=> Event("UserAction", "Navigated to Twitter", window.innerWidth > desktopSize ? "DESKTOP": "MOBILE")}>
                            <motion.div 
                                className="aboutCard"
                                initial={{scale: 1}}
                                whileHover = {{scale: 1.03}}
                            >
                                <img src={twitterlogo}/>
                                <div>
                                    <p className="smalltext">Join the conversation on Twitter:</p>
                                    <p className="socialLink">@mycountryawake</p>
                                </div>
                            </motion.div>
                        </a>
                        <a href="https://github.com/kshivanku/CAAProtests" className="aboutCardContainer" target="_blank" onClick={()=> Event("UserAction", "Navigated to Github", window.innerWidth > desktopSize ? "DESKTOP": "MOBILE")}>
                            <motion.div 
                                className="aboutCard"
                                initial={{scale: 1}}
                                whileHover = {{scale: 1.03}}
                            >
                                <img src={githublogo}/>
                                <div>
                                    <p className="smalltext">Contribute to the project:</p>
                                    <p className="socialLink">Github Repo</p>
                                </div>
                            </motion.div>
                        </a>
                        <div className="aboutCAAcontent">
                            <h3>About protests against the CAA</h3>
                            <p>
                                On the 11th of December 2019, the Citizenship (Amendment) act (CAA) was passed as a law from both houses of the Indian parliament. 
                                The act fast tracked the citizenship process to refugees of eligible religions, which was previously not granted to any illegal immigrant.
                                While any suspected immigrant of the dominant Hindu faith and most minority faiths have a path to Indian citizenship via the CAA, muslims 
                                who account for the second largest faith in the country (14.2% of population) are excluded from using it to gain citizenship and are at 
                                higher risk of being rendered stateless. <br />
                            </p>
                            <p>
                                The law has since sparked widespread protests by the Indian public for being against the secular spirit of the Indian constitution that 
                                guaranteed against the state’s discrimination based on religion.
                            </p>
                            <h4>Further reading on CAA</h4>
                            <ul>
                                <li><a className="link" href="https://github.com/kshivanku/CAAProtests/blob/master/ABOUT_CAA_NRC.md" target="_blank">Our summary of the CAA & NRC</a></li>
                                <li><a className="link" href="http://censusindia.gov.in/2011-Common/ActsAndRules.html" target="_blank">Official text of the Citizenship (Amendment) act</a></li>
                                <li><a className="link" href="https://en.wikipedia.org/wiki/Citizenship_Amendment_Act_protests" target="_blank">Wikipedia artice on CAA protest</a></li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
