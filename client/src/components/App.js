import React, {useState, useEffect} from 'react';
import Firebase from 'firebase';
import {MapLayer} from './MapLayer.js';
import {CityDetailView} from './CityDetailView.js'; 
import {SubmitForm} from './SubmitForm.js';
import {IntroScreen} from './IntroScreen';
import './CSS/App.css'

const fetchJSON = async() => {
  const res = await fetch('/getVideoData');
  const body = await res.json();
  if(res.status !== 200) throw Error(body.message)
  return body;
}

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

function App() {

  const [selectedCity, setSelectedCity] = useState(null);
  const [videoData, setVideoData] = useState({});
  const [totalCities, setTotalCities] = useState([]);
  const desktopSize = 1024;

  useEffect(()=> {
    Firebase.initializeApp(config);
    fetchJSON()
      .then(res => {
        setVideoData(res.cities);
        let citiesArray = Object.keys(res.cities);
        let urlLocation = window.location.href
        let hashCity = urlLocation.split('#')[1];
        if(hashCity !== undefined && hashCity.length>1) {setSelectedCity(hashCity)}
        setTotalCities(citiesArray);
      })
      .catch(err => console.log(err))
  },[])

  const onNewLinkSubmit = (newData) => {
    let newPostKey = Firebase.database().ref('/').push();
    newPostKey.set(newData);
  }

  const onMarkerClick = (e, city) => {
    e.preventDefault();
    city ? (window.location.hash = city) : (window.location.hash = "");
    if(selectedCity !== city) {
      setSelectedCity(city);
    }
  } 

  const onCityDetailClose = (e) => {
    e && e.preventDefault();
    setSelectedCity(null)
  }

  return (
    <div className="app">
      <IntroScreen />
      <MapLayer className="mapLayer" onMarkerClick={onMarkerClick} videoData={videoData} totalCities={totalCities} />
      <CityDetailView selectedCity={selectedCity} videoData={videoData} onCityDetailClose={onCityDetailClose} desktopSize={desktopSize} />
      <SubmitForm desktopSize={desktopSize} selectedCity={selectedCity} onNewLinkSubmit={onNewLinkSubmit}/>
    </div>
  );
}

export default App;


 