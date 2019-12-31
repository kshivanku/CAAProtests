let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let request = require('request');
const path = require('path');
const Tabletop = require('tabletop'); //arjunvenkatraman added to load data from Google Sheets directly
let arrayWithData = [];
const app = express();
const port = process.env.PORT || 5000;
const datasrc = "SHEET"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1U6HqFmMggr_N9mGh_P08yvJcohf3IdbTmTw59Sio9Ao/edit#gid=0';


app.get('/getVideoData', async (req, res) => {
  if (datasrc === "TSV") {
    let rawtsv = fs.readFileSync('./RawData/VideoData.tsv', 'utf8')
    let prevjson = JSON.parse(fs.readFileSync('./RawData/VideoData.json'))
    let revisedJSON = await tsvJSON(rawtsv, prevjson);
    fs.writeFileSync('./RawData/VideoData.json', JSON.stringify(revisedJSON, null, 2))
    console.log("Sending back TSV Response")
    res.send(revisedJSON)
  }
  if (datasrc === "SHEET") {
    // let rawtsv = fs.readFileSync('./RawData/VideoData.tsv', 'utf8')
    // let prevjson = JSON.parse(fs.readFileSync('./RawData/VideoData.json'))
    let revisedJSON = await getSheetData()
    fs.writeFileSync('./RawData/VideoData.json', JSON.stringify(revisedJSON, null, 2))
    console.log("Sending back Sheet Response")
    res.send(revisedJSON)
  }

})

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

function processSheetData(data, tabletop) {
  //console.log('showInfo active');
  // arrayWithData.push(...data);
  //console.log(arrayWithData, 'data is here')
  // return arrayWithData;
  let prevjson = JSON.parse(fs.readFileSync('./RawData/VideoData.json'))
  let prevTotalVideos = prevjson.totalVideos ? prevjson.totalVideos : 0;
  if (prevTotalVideos === data.length) {
    console.log("No New Videos")

    return (prevjson)
  } else {
    let lines = data
    for (let i = prevTotalVideos; i < lines.length; i++) {
      let currentline = lines[i];
      if (prevjson.cities && prevjson.cities[currentline['City']]) {
        prevjson.cities[currentline['City']].videos.push({
          link: currentline['Link'],
          caption: currentline['Caption'],
          date: currentline['Date']
        })
      } else {
        if (!prevjson.cities) {
          prevjson.cities = {}
        }
        prevjson.cities[currentline['City']] = {
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
    prevjson.totalVideos = lines.length;
    return (prevjson)
  }
}

function tsvJSON(tsv, prevjson) {
  return new Promise((resolve, reject) => {
    var lines = tsv.split(/\r?\n/);
    let titleLine = lines.shift();
    let captionIndex = titleLine.split(/\t/).indexOf('Caption');
    let dateIndex = titleLine.split(/\t/).indexOf('Date');
    let latIndex = titleLine.split(/\t/).indexOf('Latitude (°N)');
    let longIndex = titleLine.split(/\t/).indexOf('Longitude (°E)');
    let linkIndex = titleLine.split(/\t/).indexOf('Link');
    let cityIndex = titleLine.split(/\t/).indexOf('City');
    let prevTotalVideos = prevjson.totalVideos ? prevjson.totalVideos : 0;
    if (prevTotalVideos === lines.length) {
      resolve(prevjson)
    } else {
      for (let i = prevTotalVideos; i < lines.length; i++) {
        let currentline = lines[i].split(/\t/);
        if (prevjson.cities && prevjson.cities[currentline[cityIndex]]) {
          prevjson.cities[currentline[cityIndex]].videos.push({
            link: currentline[linkIndex],
            caption: currentline[captionIndex],
            date: currentline[dateIndex]
          })
        } else {
          if (!prevjson.cities) {
            prevjson.cities = {}
          }
          prevjson.cities[currentline[cityIndex]] = {
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
      prevjson.totalVideos = lines.length;
      resolve(prevjson)
    }
    reject({
      error: 'something went wrong in tsv to JSON conversion'
    })
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
