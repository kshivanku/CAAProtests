import React, {useState, useEffect} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {motion, AnimatePresence} from 'framer-motion'



export function MapLayer(props) {

    const {onMarkerClick, videoData, totalCities} = props;
    const [viewport, setViewport] = useState({
        latitude: 20.5937,
        longitude: 78.9629,
        width: '100vw',
        height: '100vh',
        zoom: 4
    })
    
    return (
        <div>
        <ReactMapGL 
            {...viewport} 
            mapboxApiAccessToken={"pk.eyJ1Ijoia3NoaXZhbmt1IiwiYSI6ImNpejRqcnpjMTA0bXEyeHF3aGdhNGx2MjQifQ.-5YZ6vX9kAU3CbEQlSta5g"}
            onViewportChange = {viewport => setViewport(viewport)}
            mapStyle="mapbox://styles/kshivanku/ck4o1gm6303131enp3jldbqim"
        >
            {totalCities.map((city, index) => {
            return (
                <Marker 
                    key={index}
                    latitude = {Number(videoData[city].coordinates.latitude)}
                    longitude = {Number(videoData[city].coordinates.longitude)}
                >
                    <button className='marker_btn' onClick={e => onMarkerClick(e, city)}>
                        <motion.p
                            style = {{
                                backgroundColor: `rgba(255, 60, 10, 0.5)`,
                                width: '48px',
                                height: '48px',
                                lineHeight: '48px',
                                color: '#fff',
                                fontWeight: "bold",
                                fontSize: '1.2em'
                            }}
                            className="marker_text"
                            initial = {{
                                borderRadius: '15px',
                                scale: 1
                            }}
                            animate= {{
                                borderRadius: '24px',
                                scale: 1.2
                            }}
                            transition = {{
                                yoyo: Infinity,
                                ease: 'easeOut',
                                duration: 0.5
                            }}
                            >{videoData[city].videos.length}
                        </motion.p>
                    </button>
                </Marker>
            )
            })}
            
        </ReactMapGL>
        </div>
    )
}