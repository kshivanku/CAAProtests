import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export function CityDetailView(props) {
    const {selectedCity, videoData, onCityDetailClose} = props;
    return (
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              style = {{
                width: '100vw',
                maxHeight: '50vh',
                overflow: 'scroll',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                padding: '16px',
                paddingBottom: '100px',
                position: 'absolute',
                bottom: 0,
                display: 'grid',
                gridTemplateRows: '24px 1fr',
                gridTemplateColumns: '1fr 360px 1fr'
              }}
              
              initial = {{y: 300, opacity: 0}}
              animate = {{y: 0, opacity: 1}}
              exit = {{y: 300, opacity: 0, transition:{ease:'easeOut'}}}
              // transition = {{ease: 'easeOut', duration: 0.5}}
            >
              <div
                style={{
                  gridColumn: 2
                }}
              >
                <button onClick={(e) => onCityDetailClose(e)}>Close</button>
              </div>
              <div
                style={{
                  gridColumn: 2
                }}
              >
                <h1>{selectedCity}</h1>
                {videoData[selectedCity].videos.map((link, index) => (
                  <a href={link} key={index} target="_blank" style={{display: "block", marginBottom: '8px', color:'#fff'}}>{link} </a>
                ))}
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
    )
}