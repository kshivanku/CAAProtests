import React, { useEffect } from 'react';
import {motion, useMotionValue, useAnimation, AnimatePresence} from 'framer-motion';
import {TwitterVideoEmbed} from 'react-twitter-embed';
import close from '../icons/close.svg'

export function CityDetailView(props) {
    const {selectedCity, videoData, onCityDetailClose, desktopSize } = props;
    let currentScrollValue = useMotionValue(0);
    let touchStart = 0;
    let touchEnd = 0;
    // let prevScrollValue = useMotionValue(0);
    const containerAnimControls = useAnimation();
    const headerAnimControls = useAnimation();
    const bodyAnimControls = useAnimation();

    const closeTransition = {ease: 'easeOut', duration: 0.2}
    const openTransition = {type: 'spring', damping: 16}

    const variants = {
        open: (window.innerWidth > desktopSize) ? {width: '30em', top: 0, transition: openTransition}:{width: 'calc(var(--vw, 1vw) * 100)', top: 'calc(var(--vh, 1vh) * 20)', transition: openTransition},
        close: (window.innerWidth > desktopSize) ? {width: 0, top: 0, y: 0, transition: closeTransition} : {width: 'calc(var(--vw, 1vw) * 100)', top: 'calc(var(--vh, 1vh) * 100)', y: 0, transition: closeTransition}
    }

    const childVariants = {
        open: {opacity: 1, y: 0, transition: {ease: 'easeOut'}}, close: {opacity: 0, y: 10, transition: {ease: 'linear'}}
    }

    const scrollToTop = {top: 0, transition:{ease:'linear', duration: 0.2}}

    const handleInOutAnimation = async () => {
        if(selectedCity) {
            containerAnimControls.start(variants.open)
            await headerAnimControls.start(childVariants.open)
            bodyAnimControls.start(childVariants.open)
        }
        else { 
            await headerAnimControls.start(childVariants.close)
            await bodyAnimControls.start(childVariants.close)
            containerAnimControls.start(variants.close)
        }
    }

    useEffect(()=> {
        handleInOutAnimation()
        window.addEventListener('touchstart', function(e){touchStart=e.changedTouches[0].clientY})
        window.addEventListener('touchend', function(e) {
            touchEnd = e.changedTouches[0].clientY;
            if(currentScrollValue.get() <= 0 && touchEnd > touchStart) {
                onCityDetailClose();
                touchStart = 0;
                touchEnd = 0;
            }
        });
        // window.addEventListener('wheel', function() {
        //     setTimeout(()=> {
        //         if(currentScrollValue.get() === prevScrollValue.get()) {
        //             onCityDetailClose();
        //             prevScrollValue.set(0)
        //         }
        //         else {
        //             prevScrollValue.set(currentScrollValue.get())
        //         }
        //     }, 500)
        // })
    }, [selectedCity])

    return (
        <AnimatePresence>
          {selectedCity && (
            <motion.div
                className="cityDetailView"
                variants={variants}
                initial="close"
                exit="close"
                animate = {containerAnimControls}
                onScroll = {(e) => {
                    currentScrollValue.set(e.nativeEvent.target.scrollTop);
                    if(currentScrollValue.get() > 0) {
                        containerAnimControls.start(scrollToTop)
                    }
                }}
                style={{height: 'calc(var(--vh, 1vh) * 100)', overflow: 'scroll', scrollBehavior: 'smooth', overscrollBehaviorY: 'none'}}
            >   
                <motion.div 
                    className="cityDetailView_Header" 
                    variants={childVariants}
                    initial="close"
                    animate = {headerAnimControls}
                >
                    <h1>{selectedCity}</h1>
                    <button className="close_btn" onClick={(e) => onCityDetailClose(e)}>
                        <img src={close} alt="close icon" />
                    </button>
                </motion.div>
                <motion.div 
                    className="cityDetailView_videoList" 
                    variants={childVariants}
                    initial="close"
                    animate={bodyAnimControls}
                    
                >
                    {videoData[selectedCity].videos.slice(0).reverse().map((videoObj, index) => {
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