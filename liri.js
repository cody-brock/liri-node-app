//1) Require Files
require("dotenv").config();

var keys = require("./keys.js");

var $ = require('jquery');

var request = require("request");

var moment = require("moment");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// You should then be able to access your keys information like so
// var spotify = new spotify(keys.spotify);

// 2) Take in user input

let userRequest = process.argv[2];

switch (userRequest) {
    case 'concert-this':
        concertThis();
        break;
    case 'spotify-this-song':
        spotifyThisSong();
        break;
}

// 3) API Calls
function concertThis() {
    let artist = process.argv[3];
    console.log(`Searching for ${artist}'s next concerts...`);
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let json = (JSON.parse(body));
            for (let i = 0; i < json.length; i++) {
                console.log(json[i].venue.name);
                console.log(`${json[i].venue.city}, ${json[i].venue.country}`)
                console.log(moment(json[i].datetime).format("MM-DD-YYYY"));
                console.log("*******************")
            }
        }
    });
}

function spotifyThisSong() {
    let songName = process.argv[3];
    console.log(`Searching for the song ${songName} in Spotify...`);
    spotify.search({type: 'track', query: songName}, function(err, data) {
        if (err) {
            return console.log(`Error occurred: ${err}`);
        }

        for (let i = 0; i < data.tracks.items.length; i++) {
            // console.log(data.tracks.items[0]);
            
            console.log(data.tracks.items[i].artists[0].name);
            console.log(data.tracks.items[i].name)
            if (data.tracks.items[i].preview_url === null) {
                console.log("No preview available for this song")
            } else {
                console.log(data.tracks.items[i].preview_url)
            }
            console.log(data.tracks.items[i].album.name);
            console.log("*******************")
        }


    })
}