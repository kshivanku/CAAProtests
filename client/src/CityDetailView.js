import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {TwitterVideoEmbed} from 'react-twitter-embed';
import { useMediaQuery } from 'react-responsive';

export function CityDetailView(props) {
    
    const {selectedCity, videoData, onCityDetailClose} = props;
    const isDesktop = useMediaQuery({query: '(min-device-width: 1024px)'})
    const variants_desktop = {
        open: {
            x: 0,
            opcaity: 1,
            transition: {type: 'spring', damping: 300}
        },
        close: {
            x: 300, 
            opacity: 0,
            transition:{ease:'easeOut', duration: 3.5}
        }
    }

    const variants_mobile = {
        open: {
            y: 0,
            opcaity: 1,
            transition: {type: 'spring', damping: 300}
        },
        close: {
            y: 300, 
            opacity: 0,
            transition:{ease:'easeOut', duration: 3.5}
        }
    }

    return (
        <AnimatePresence>
          {selectedCity && (
            <motion.div 
                className="cityDetailView"
                variants =  {isDesktop ? {variants_desktop} : {variants_mobile}}
                initial = "close"
                animate = "open"
                exit = "close"
            >   
                <div className="cityDetailView_Header">
                    <h1>{selectedCity}</h1>
                    <button onClick={(e) => onCityDetailClose(e)}>Close</button>
                </div>
                <div className="cityDetailView_videoList">
                    {videoData[selectedCity].videos.map((link, index) => {
                        if(link.indexOf('twitter') !== -1) {
                            let id = link.split(/\/?\//)[4].split('?')[0];
                            console.log(id)
                            return <TwitterVideoEmbed id={id} key={id + index}/>
                        }
                        else {
                            return <a href={link} key={index} target="_blank" style={{display: "block", marginBottom: '8px', color:'#fff'}}>{link} </a>
                        }   
                    })}
                </div>  
              
            </motion.div>
          )}
        </AnimatePresence>
    )
}