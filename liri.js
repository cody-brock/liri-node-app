//1) Require Files
require("dotenv").config();

var keys = require("./keys.js");

var $ = require('jquery');

var request = require("request");

var moment = require("moment");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var fs = require("fs");

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
    case 'movie-this':
        movieThis();
        break;
    case 'do-what-it-says':
        doWhatItSays();
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
    //If user doesn't specify song, it defaults to "The Sign."
    let songName
    if (process.argv.length === 3) {
        songName = "The Sign";
    } else {
        songName = process.argv[3];
    }

    console.log(`Searching for the song ${songName} in Spotify...`);

    spotify.search({type: 'track', query: songName}, function(err, data) {
        if (err) {
            return console.log(`Error occurred: ${err}`);
        }

        for (let i = 0; i < data.tracks.items.length; i++) {
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

function movieThis() {
    let movieName
    if (process.argv.length === 3) {
        movieName = "Mr. Nobody";
    } else {
        movieName = process.argv[3];
    }

    axios.get("https://www.omdbapi.com/?apikey=trilogy&t=" + movieName)
        .then(function (response) {
            console.log(response.data.Title);
            console.log(response.data.Year)
            console.log(response.data.imdbRating)
            console.log(response.data.Ratings[1].Value);
            console.log(response.data.Country);
            console.log(response.data.Language);
            console.log(response.data.Plot);
            console.log(response.data.Actors);

        }).catch(function (error) {
            console.log(error);
        })
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(err, data) {

        let newResult = data.split(",");

        let userRequest = newResult[0];
        let input = newResult[1];

        switch (userRequest) {
            case 'concert-this':
                concertThis(input);
                break;
            case 'spotify-this-song':
                spotifyThisSong(input);
                break;
            case 'movie-this':
                movieThis(input);
                break;
            case 'do-what-it-says':
                doWhatItSays(input);
                break;
        }
        
    })
}