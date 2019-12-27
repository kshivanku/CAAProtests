let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/getVideoData', async (req, res) => {
    let rawcsv = fs.readFileSync('./RawData/VideoData.csv', 'utf8')
    let prevjson = JSON.parse(fs.readFileSync('./RawData/VideoData.JSON'))
    let revisedJSON = await csvJSON(rawcsv, prevjson);
    fs.writeFileSync('./RawData/VideoData.JSON', JSON.stringify(revisedJSON, null, 2))
    res.send(revisedJSON)
})

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