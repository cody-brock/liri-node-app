//SECTION 1: REQUIRE FILES
require("dotenv").config();

var keys = require("./keys.js");

var request = require("request");

var moment = require("moment");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var fs = require("fs");


//SECTION 2: USER INPUT & APP LOGIC
function userCommand(userInput, userQuery) {
    switch (userInput) {
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
        default:
            console.log("I'm sorry, I don't understand.  Please try asking again.");
            break;
    }
}

userCommand(process.argv[2], process.argv[3]);


//SECTION 3: API CALLS
function concertThis() {
    let artist = process.argv[3];
    console.log(`Searching for ${artist}'s next concerts...`);
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let json = (JSON.parse(body));
            console.log(`CONCERT RESULTS: \n`)
            for (let i = 0; i < json.length; i++) {
                let concertDate = moment(json[i].datetime).format("MM-DD-YYYY");
                console.log(`Venue Name: ${json[i].venue.name} \n Location: ${json[i].venue.city}, ${json[i].venue.country} \n Date: ${concertDate} \n *******************`);
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

    console.log(`Searching for the song ${songName} in Spotify...\n`);

    spotify.search({type: 'track', query: songName}, function(err, data) {
        if (err) {
            return console.log(`Error occurred: ${err}`);
        }

        console.log(`SONG RESULTS \n`);

        for (let i = 0; i < data.tracks.items.length; i++) {

            let previewUrl
            if (data.tracks.items[i].preview_url === null) {
                previewUrl = "No preview available for this song"
            } else {
                previewUrl = data.tracks.items[i].preview_url;
            }

            console.log(`Artist: ${data.tracks.items[i].artists[0].name} \n Song Title: ${data.tracks.items[i].name} \n Preview URL: ${previewUrl} \n Album Title: ${data.tracks.items[i].album.name} \n *******************`);
        
        }
    })
}

function movieThis() {
    let movieName
    if (process.argv.length < 4) {
        movieName = "Mr. Nobody";
    } else {
        movieName = process.argv[3];
    }

    console.log(`Searching for the ${movieName} in OMDB...\n`)

    axios.get("https://www.omdbapi.com/?apikey=trilogy&t=" + movieName)
        .then(function (response) {

            let rtRating = response.data.Ratings[1].Value;
            if (rtRating === "undefined") {
                rtRating = "No Rotten Tomatoes Rating Available";
            } 

            console.log(`MOVIE RESULTS: \nMovie Name: ${response.data.Title}\nRelease Year: ${response.data.Year}\nIMDB Rating: ${response.data.imdbRating}\nRotten Tomatoes Rating: ${rtRating}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}\n`)

        }).catch(function (error) {
            console.log(error);
        })
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(err, data) {

        if (err) {
            return console.log(`Error occurred: ${err}`);
        }

        let newResult = data.split(",");

        userCommand(newResult[0], newResult[1]);
        
    })
}