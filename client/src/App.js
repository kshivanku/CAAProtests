import React, {useState, useEffect} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl'
import {motion, AnimatePresence} from 'framer-motion'

import './App.css';
import { urlencoded } from 'body-parser';

const fetchJSON = async() => {
  console.log("fetchJSON")
  const res = await fetch('/getVideoData');
  const body = await res.json();
  if(res.status !== 200) throw Error(body.message)
  return body;
}

function App() {

  const [viewport, setViewport] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    width: '100vw',
    height: '100vh',
    zoom: 4
  })

  const [videoData, setVideoData] = useState({})
  const [totalCities, setTotalCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(()=> {
    fetchJSON()
      .then(res => {
        console.log("Back inside useEffect");
        console.log(res);
        setVideoData(res.cities);
        let citiesArray = Object.keys(res.cities);
        setTotalCities(citiesArray);
      })
      .catch(err => console.log(err))
  },[])

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
              <button className='marker_btn' onClick={e => {
                e.preventDefault();
                setSelectedCity(city);
              }}>
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
                >{videoData[city].videos.length}</motion.p>
              </button>
            </Marker>
          )
        })}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              style = {{
                width: '100vw',
                maxHeight: '80vh',
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
                <button onClick={() => setSelectedCity(null)}>Close</button>
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
      </ReactMapGL>
    </div>
  );
}

export default App;


 