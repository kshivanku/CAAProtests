let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let request = require('request');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/getVideoData', async (req, res) => {
    let rawcsv = fs.readFileSync('./RawData/VideoData.csv', 'utf8')
    let prevjson = JSON.parse(fs.readFileSync('./RawData/VideoData.json'))
    let revisedJSON = await csvJSON(rawcsv, prevjson);
    fs.writeFileSync('./RawData/VideoData.json', JSON.stringify(revisedJSON, null, 2))
    res.send(revisedJSON)
})

app.post('/getTwitterEmbedInfo', async (req, res) => {
    console.log("inside getTwitterEmbedInfo")
    let reqUrl = await buildUrl('https://publish.twitter.com/oembed', {url: req.body.url,theme: 'dark',widget_type: 'video'})
    request( {url: reqUrl}, (err, resp, body) => {
        let bodyJSON = JSON.parse(body);
        console.log(bodyJSON)
        res.send(bodyJSON)
    })
})

function buildUrl(url, parameters) {
    return new Promise((resolve, reject) => {
        let qs = "";
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                const value = parameters[key];
                qs +=
                    encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
            }
        }
        if (qs.length > 0) {
            qs = qs.substring(0, qs.length - 1); //chop off last "&"
            url = url + "?" + qs;
        }
        console.log(url);
        resolve(url);
    })
}

function csvJSON(csv, prevjson){
    return new Promise((resolve, reject) => {
        var lines=csv.split(/\r?\n/);
        lines.shift();
        let prevTotalVideos = prevjson.totalVideos ? prevjson.totalVideos : 0 ;
        if(prevTotalVideos === lines.length) {
            resolve(prevjson)
        }
        else{
            for(let i = prevTotalVideos ; i < lines.length ; i++) {
                let currentline = lines[i].split(",");
                if(prevjson.cities && prevjson.cities[currentline[1]]) {
                    prevjson.cities[currentline[1]].videos.push(currentline[0])
                }
                else {
                    if(!prevjson.cities) {
                        prevjson.cities = {}
                    }
                    prevjson.cities[currentline[1]] = {
                        videos: [currentline[0]],
                        coordinates: {
                            latitude: currentline[2],
                            longitude: currentline[3]
                        }
                    }
                }
            }
            prevjson.totalVideos = lines.length;
            resolve(prevjson)
        }
        reject({
            error: 'something went wrong in csv to JSON conversion'
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

app.listen(port, ()=> console.log(`Listening on port: ${port}`));