import React, {useState, useEffect} from 'react';
import Firebase from 'firebase';
import {PageView, initGA} from './Tracking';
import {MapLayer} from './MapLayer.js';
import {CityDetailView} from './CityDetailView.js'; 
import {SubmitForm} from './SubmitForm.js';
import {IntroScreen} from './IntroScreen';
import {About} from './About'
import {SecNav} from './SecNav.js'
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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const desktopSize = 1024;

  useEffect(()=> {
    Firebase.initializeApp(config);
    initGA(process.env.REACT_APP_GA_TRACKING_ID);
    PageView('Intro')
    fetchJSON()
      .then(res => {
        setVideoData(res.cities);
        let citiesArray = Object.keys(res.cities);
        let urlLocation = window.location.href
        let hashCity = urlLocation.split('#')[1];
        if(hashCity !== undefined && hashCity.length>1) {
          let formattedHashCity = hashCity.charAt(0).toUpperCase() + hashCity.slice(1);
          if(citiesArray.indexOf(formattedHashCity) !== -1) {
            setSelectedCity(formattedHashCity);
          }
        }
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
    if(city){window.location.hash = city; window.scrollTo({top: 0, left: 0, behavior: 'smooth'})}
    else{window.location.hash = ""}
    if(selectedCity !== city) {
      setSelectedCity(city);
    }
  } 

  const onCityDetailClose = (e) => {
    e && e.preventDefault();
    setSelectedCity(null)
  }

  const handleAboutClicked = () => {
    window.location.hash = "about"
    setIsAboutOpen(true);
  }

  const handleAboutClose = () => {
    window.location.hash = "/"
    setIsAboutOpen(false);
  }

  return (
    <div className="app">
      {/* <IntroScreen selectedCity={selectedCity} desktopSize={desktopSize}/> */}
      {isAboutOpen && <About handleAboutClose={handleAboutClose} desktopSize={desktopSize} />}
      <SecNav handleAboutClicked = {handleAboutClicked}/>
      <MapLayer className="mapLayer" onMarkerClick={onMarkerClick} videoData={videoData} totalCities={totalCities} />
      {selectedCity && <CityDetailView selectedCity={selectedCity} videoData={videoData} onCityDetailClose={onCityDetailClose} desktopSize={desktopSize} />}
      <SubmitForm desktopSize={desktopSize} selectedCity={selectedCity} onNewLinkSubmit={onNewLinkSubmit}/>
    </div>
  );
}

export default App;


 