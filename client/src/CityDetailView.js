import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {TwitterVideoEmbed} from 'react-twitter-embed';

export function CityDetailView(props) {
    
    const {selectedCity, videoData, onCityDetailClose} = props;
    const [embedTweetInfo, setEmbedTweetInfo] = useState(null);
    useEffect(()=> {
        {selectedCity && TwitterEmbed('https://twitter.com/alishakhan102/status/1208461878646542336?s=20')}
    }, [selectedCity])

    const TwitterEmbed = (url) => {
        fetch('/getTwitterEmbedInfo', {
            method: 'POST',
            body: JSON.stringify({url: url}),
            headers: {
                'Content-Type': 'application/json'
              },
        })
        .then(res => {
            return res.json();
        })
        .then(body => {
            console.log('inside body')
            console.log(body);
            console.log(body.html);
            // var parser = new DOMParser();
            // var doc = parser.parseFromString(body.html, 'text/html');
            // console.log(doc)
            setEmbedTweetInfo(body.html);
        })
        .catch(err => console.log(err))
    }

    return (
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              style = {{
                width: '100vw',
                maxHeight: '50vh',
                overflow: 'scroll',
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
                <button onClick={(e) => onCityDetailClose(e)}>Close</button>
              </div>
              <div
                style={{
                  gridColumn: 2
                }}
              >
                <h1>{selectedCity}</h1>
                {/* {<div dangerouslySetInnerHTML={{__html: embedTweetInfo}}></div>} */}
                {/* <p><iframe src="https://twitframe.com/show?url=https://twitter.com/alishakhan102/status/1208461878646542336?s=20" border="0" height="560px" width="550" frameBorder="0"></iframe></p>
                <p>&nbsp;</p> */}
                {videoData[selectedCity].videos.map((link, index) => {
                    if(link.indexOf('twitter') != -1) {
                        let id = link.split(/\/?\//)[4].split('?')[0];
                        console.log(id);
                        return <TwitterVideoEmbed id={id}/>
                    }
                    else {
                        return <a href={link} key={index} target="_blank" style={{display: "block", marginBottom: '8px', color:'#fff'}}>{link} </a>
                    }   
                })}
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
    )
}