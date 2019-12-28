import React, {useState, useEffect} from 'react';
import {MapLayer} from './MapLayer.js';
import {CityDetailView} from './CityDetailView.js'; 
import './App.css';

const fetchJSON = async() => {
  const res = await fetch('/getVideoData');
  const body = await res.json();
  if(res.status !== 200) throw Error(body.message)
  return body;
}

function App() {

  const [selectedCity, setSelectedCity] = useState(null);
  const [videoData, setVideoData] = useState({})
  const [totalCities, setTotalCities] = useState([])

  useEffect(()=> {
    fetchJSON()
      .then(res => {
        setVideoData(res.cities);
        let citiesArray = Object.keys(res.cities);
        setTotalCities(citiesArray);
      })
      .catch(err => console.log(err))

    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      let vw = window.innerWidth * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--vw', `${vw}px`);
    })

  },[])

  const onMarkerClick = (e, city) => {
    e.preventDefault();
    if(selectedCity !== city) {
      setSelectedCity(city);
    }
  } 

  const onCityDetailClose = (e) => {
    e.preventDefault();
    setSelectedCity(null)
  }

  return (
    <div className="app">
      <MapLayer className="mapLayer" onMarkerClick={onMarkerClick} videoData={videoData} totalCities={totalCities} />
      <CityDetailView selectedCity={selectedCity} videoData={videoData} onCityDetailClose={onCityDetailClose} />
    </div>
  );
}

export default App;


 