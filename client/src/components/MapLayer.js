import React, {useState, useEffect} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {motion} from 'framer-motion'

export function MapLayer(props) {

    const {onMarkerClick, videoData, totalCities} = props;
    const [viewport, setViewport] = useState({
        latitude: 20.5937,
        longitude: 78.9629,
        width: 'calc(var(--vw, 1vw) * 100)',
        height: 'calc(var(--vh, 1vh) * 100)',
        zoom: 4
    })

    useEffect(()=> {
        window.addEventListener('resize', () => {
            let newWidth = window.innerWidth;
            let newHeight = window.innerHeight;
            setViewport(prevState => {return {...prevState, width: newWidth, height: newHeight}});
          });
    }, [])
    
    return (
        <div>
        <ReactMapGL 
            {...viewport} 
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN}
            onViewportChange = {viewport => setViewport(viewport)}
            mapStyle="mapbox://styles/kshivanku/ck4rqg7rq331v1cmttxjco1el"
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
                            style={{
                                borderRadius: '24px'
                            }}
                            className="marker_txt"
                            initial = {{
                                scale: 1
                            }}
                            animate= {{
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

// STYLES:
// mapbox://styles/kshivanku/ck4o1gm6303131enp3jldbqim