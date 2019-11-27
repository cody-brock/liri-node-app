//1) Require Files
require("dotenv").config();

var $ = require('jquery');

var request = require("request");

var moment = require("moment");

var keys = require("./keys.js");

// You should then be able to access your keys information like so
// var spotify = new spotify(keys.spotify);

// 2) Take in user input

let userRequest = process.argv[2];

switch (userRequest) {
    case 'concert-this':
    concertThis();
}

// 3) API Calls
function concertThis() {
    let artist = process.argv[3];
    console.log(`Searching for ${artist}'s next concerts...`);
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            json = (JSON.parse(body));
            // for (let i = 0; i < json.length; i++) {
                console.log(json[0].venue.name);
                console.log(`${json[0].venue.city}, ${json[0].venue.country}`)
                // console.log(json[0].datetime)
                console.log(moment(json[0].datetime).format("MM-DD-YYYY"));
            // }
        }
    });
}