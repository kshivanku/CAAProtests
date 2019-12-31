import React from 'react';
import {motion, AnimatePresence, useMotionValue} from 'framer-motion';
import {TwitterVideoEmbed} from 'react-twitter-embed';
import close from '../icons/close.svg'

export function CityDetailView(props) {
    const {selectedCity, videoData, onCityDetailClose, desktopSize } = props;
    const y = useMotionValue(0);

    const closeTransition = {ease: 'easeOut', duration: 0.2, staggerChildren: 0.05, when: "afterChildren", staggerDirection: -1}
    const openTransition = {type: 'spring', damping: 16, staggerChildren: 0.1, delayChildren: 0.3}

    const variants = {
        open: (window.innerWidth > desktopSize) ? {width: '30em', height: 'calc(var(--vh, 1vh) * 100)', overflowY: 'scroll', transition: openTransition}:{width: 'calc(var(--vw, 1vw) * 100)', height: 'calc(var(--vh, 1vh) * 90)', overflowY: 'scroll', transition: openTransition},
        close: (window.innerWidth > desktopSize) ? {width: 0, height: 'calc(var(--vh, 1vh) * 100)', overflow: 'hidden', transition: closeTransition} : {width: 'calc(var(--vw, 1vw) * 100)', height: 0, overflow: 'hidden', transition: closeTransition}
    }

    const childVariants = {
        open: {opacity: 1, y: 0, transition: {ease: 'easeOut'}}, close: {opacity: 0, y: 10, transition: {ease: 'linear'}}
    }

    return (
        <AnimatePresence>
          {selectedCity && (
            <motion.div 
                y = {y}
                className="cityDetailView"
                variants = {variants}
                initial = "close"
                animate = "open"
                exit = "close"
                // drag = {(window.innerWidth > desktopSize) ? false : "y"}
                // dragConstraints={{ top: 20, bottom: 20 }}
                // dragElastic={0.2}
                // onDragEnd = {() => {
                //     if(y.get() < - 20) {

                //     }
                // }} 
            >   
                <motion.div className="cityDetailView_Header" variants={childVariants}>
                    <h1>{selectedCity}</h1>
                    <button className="close_btn" onClick={(e) => onCityDetailClose(e)}>
                        <img src={close} alt="close icon" />
                    </button>
                </motion.div>
                <motion.div className="cityDetailView_videoList" variants={childVariants}>
                    {videoData[selectedCity].videos.map((videoObj, index) => {
                        if(videoObj.link.indexOf('twitter.com') !== -1) {
                            let id = videoObj.link.split(/\/?\//)[4].split('?')[0];
                            return (
                                <div className="linkCard" key={id + index}>
                                    <p>{videoObj.date}</p>
                                    <h2>{videoObj.caption}</h2>
                                    <TwitterVideoEmbed id={id} 
                                        onLoad={e => {if(e){e.style.display = "inline-block"}}} 
                                    />
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="linkCard" key={index}>
                                    <p>{videoObj.date}</p>
                                    <h2>{videoObj.caption}</h2>
                                    <a href={videoObj.link} target="_blank" className='rawLink'>{videoObj.link} </a>
                                </div>
                            )
                        }   
                    })}
                </motion.div>  
              
            </motion.div>
          )}
        </AnimatePresence>
    )
}