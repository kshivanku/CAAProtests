import ReactGA from "react-ga";

export const initGA = (trackingID) => {           
    ReactGA.initialize(trackingID); 
 }

 export const PageView = (cityName) => {  
    ReactGA.pageview(cityName); 
}

export const Event = (category, action, label) => {
    ReactGA.event({
      category: category,
      action: action,
      label: label
    });
  };