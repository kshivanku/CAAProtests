import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import close from '../icons/close.svg'
import twitterlogo from '../icons/twitterlogo.svg'

export function About(props) {
    let {handleAboutClose} = props
    let containerVariants = {
        open: {opacity: 1},
        close: {opacity: 0, transition: {when: 'afterChildren'}}
    }
    let contentVariants = {
        open: {opacity: 1, y: 0},
        close: {opacity: 0, y: 20}
    }
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
                    className = "aboutContent"
                    variants = {contentVariants}
                >
                    <div className="aboutContentHeader">
                        <h1>Law Makers, Law Breakers</h1>
                        <button className="close_btn" onClick={() => handleAboutClose()}><img src={close}  alt="close button" /></button>
                    </div>
                    <div className="aboutContentBody">
                        <p>
                            <span style={{fontWeight: "bold"}}>Law Makers, Law Breakers </span> 
                            is a project that aims to objectively document how we, the citizens of India, are opposing the Citizenship Ammendment Act, a deeply unpopular and unconstitutional law, brought by the government of India, in Dec 2019. 
                        </p>
                        
                        <div className="aboutTwitterSection">
                            <img src={twitterlogo}/>
                            <div>
                                <p className="smalltext">Join the conversation on Twitter:</p>
                                <p className="twittername"><a href="#" >@mycountryawake</a></p>
                            </div>
                        </div>
                        <div className="aboutCAAcontent">
                            <h3>About protests against the CAA</h3>
                            <p>
                                The Citizenship Amendment Act protests, also known as the CAA and NRC protests, the Citizenship (Amendment) Bill and National Register of Citizens protests, or the CAB and NRC protests, are a series of ongoing protests in India, against the Citizenship (Amendment) Act (CAA), which was enacted into law on 12 December 2019, and against proposals to enact a nationwide National Register of Citizens (NRC)
                            </p>
                            <h4>Further reading on CAA</h4>
                            <ul>
                                <li><a href="http://censusindia.gov.in/2011-Common/ActsAndRules.html" target="_blank">Official copy of the Act</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Citizenship_Amendment_Act_protests" target="_blank">CAA on wikipedia</a></li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}