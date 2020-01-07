let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let request = require('request');
const path = require('path');
const Tabletop = require('tabletop'); //arjunvenkatraman added to load data from Google Sheets directly
let arrayWithData = [];
const app = express();
const port = process.env.PORT || 5000;
const datasrc = "SHEET" // "TSV" or "SHEET"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1a05RMjtnV49O6l8zVXO3ScX6pcrRXBAOI76F-jUUNfc/edit?usp=sharing';

// Datasource check with datasrc var
app.get('/getVideoData', async (req, res) => {
  if (datasrc === "TSV") {
    let rawtsv = fs.readFileSync('./RawData/VideoData.tsv', 'utf8')
    let revisedJSON = await tsvJSON(rawtsv);
    fs.writeFileSync('./RawData/VideoData.json', JSON.stringify(revisedJSON, null, 2))
    console.log("Sending back TSV Response")
    res.send(revisedJSON)
  }
  if (datasrc === "SHEET") {
    let revisedJSON = await getSheetData();
    fs.writeFileSync('./RawData/VideoData.json', JSON.stringify(revisedJSON, null, 2))
    console.log("Sending Sheet Response")
    res.send(revisedJSON)
  }

})

// Pulling from Google Sheets with Tabletop 
function getSheetData() {
  return new Promise((resolve) => {
    Tabletop.init({
      key: publicSpreadsheetUrl,
      callback: function(data, tabletop) {
        resolve(processSheetData(data, tabletop));
      },
      simpleSheet: true
    })
  })
}

//Cleaning up the sheet data 
function processSheetData(data, tabletop) {
    let newjson = {"cities":{},"totalVideos":0}
    data.map(currentline => {
        if(!isNaN(currentline['Latitude (°N)']) && !isNaN(currentline['Longitude (°E)'])) {
            if(newjson.cities[currentline['City']] !== undefined) {
                newjson.cities[currentline['City']].videos.push({
                    link: currentline['Link'],
                    caption: currentline['Caption'],
                    date: currentline['Date']
                })
            }
            else {
                newjson.cities[currentline['City']] = {
                    videos: [{
                        link: currentline['Link'],
                        caption: currentline['Caption'],
                        date: currentline['Date']
                    }],
                    coordinates: {
                    latitude: currentline['Latitude (°N)'],
                    longitude: currentline['Longitude (°E)']
                    }
                }
            }
        }
    })
    let sortable = [];
    for (let city in newjson.cities) {
        sortable.push([city, newjson.cities[city]]);
    }
    sortable.sort((a,b) => (a[1].videos.length > b[1].videos.length) ? 1 : ((b[1].videos.length > a[1].videos.length) ? -1 : 0));
    let objSorted = {}
    sortable.forEach(function(item){
        objSorted[item[0]]=item[1]
    })
    newjson.cities = objSorted
    newjson.totalVideos = data.length;
    return (newjson)
}

//Cleaning up the TSV data 
function tsvJSON(tsv) {
  return new Promise((resolve, reject) => {
    var lines = tsv.split(/\r?\n/);
    let titleLine = lines.shift();
    let captionIndex = titleLine.split(/\t/).indexOf('Caption');
    let dateIndex = titleLine.split(/\t/).indexOf('Date');
    let latIndex = titleLine.split(/\t/).indexOf('Latitude (°N)');
    let longIndex = titleLine.split(/\t/).indexOf('Longitude (°E)');
    let linkIndex = titleLine.split(/\t/).indexOf('Link');
    let cityIndex = titleLine.split(/\t/).indexOf('City');
    let newjson = {"cities":{},"totalVideos":0}

    lines.map(line => {
        let currentline = line.split(/\t/);
        if(!isNaN(currentline['Latitude (°N)']) && !isNaN(currentline['Longitude (°E)'])) {
            if(newjson.cities[currentline[cityIndex]] != undefined) {
                newjson.cities[currentline[cityIndex]].videos.push({
                    link: currentline[linkIndex],
                    caption: currentline[captionIndex],
                    date: currentline[dateIndex]
                })
            }
            else {
                newjson.cities[currentline[cityIndex]] = {
                    videos: [{
                        link: currentline[linkIndex],
                        caption: currentline[captionIndex],
                        date: currentline[dateIndex]
                    }],
                    coordinates: {
                        latitude: currentline[latIndex],
                        longitude: currentline[longIndex]
                    }
                }
            }
        }
    })
    newjson.totalVideos = lines.length;
    resolve(newjson);
    // reject({
    //   error: 'something went wrong in tsv to JSON conversion'
    // })
  })
}

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port: ${port}`));


//TWITTER EMBED API INFO
// app.post('/getTwitterEmbedInfo', async (req, res) => {
//     console.log("inside getTwitterEmbedInfo")
//     let reqUrl = await buildUrl('https://publish.twitter.com/oembed', {url: req.body.url,theme: 'dark',widget_type: 'video'})
//     request( {url: reqUrl}, (err, resp, body) => {
//         let bodyJSON = JSON.parse(body);
//         console.log(bodyJSON)
//         res.send(bodyJSON)
//     })
// })

// function buildUrl(url, parameters) {
//     return new Promise((resolve, reject) => {
//         let qs = "";
//         for (const key in parameters) {
//             if (parameters.hasOwnProperty(key)) {
//                 const value = parameters[key];
//                 qs +=
//                     encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
//             }
//         }
//         if (qs.length > 0) {
//             qs = qs.substring(0, qs.length - 1); //chop off last "&"
//             url = url + "?" + qs;
//         }
//         console.log(url);
//         resolve(url);
//     })
// }
