
require('dotenv').config();
var keys = require('./keys.js');
var twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require('fs');


console.log("Type my-tweets , spotify-this-song , movie-this , or do-what-it-says to get started!");

var userCommand = process.argv[2];
var secondCommand = process.argv[3];

	for(i=4; i<process.argv.length; i++){
	    secondCommand += '+' + process.argv[i];
	}

function Switch(){

	switch(userCommand){

		case 'my-tweets':
		myTweets();
		break;

		case 'spotify-this-song':
		spotifyThis();
		break;

		case 'movie-this':
		movieThis();
		break;

		case 'do-what-it-says':
		doIt();
		break;
		
	}
};

function myTweets(){
	console.log("Tweets");
	
	var client = new twitter({
		consumer_key: keys.twitter.consumer_key,
		consumer_secret: keys.twitter.consumer_secret,
		access_token_key: keys.twitter.access_token_key,
		access_token_secret: keys.twitter.access_token_secret
	});

	var parameters = {
		screen_name: 'Nick Holmin',
		count: 20
	};

	client.get('statuses/user_timeline', parameters, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
	    };
	});
};

function spotifyThis(){
	console.log("Spotify");

	var spotify = new Spotify({
	  id: keys.spotify.id,
	  secret: keys.spotify.secret
	});

	var searchTrack;
	if(secondCommand === undefined){
		searchTrack = "Wait So Long";
	}else{
		searchTrack = secondCommand;
	}
	
	spotify.search ({type:'track', query: searchTrack}, function(err,data){
	    if(err){
	        return console.log('Error occurred: ' + err);
	    }else{
	        
	  		console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    }
	});
};

function movieThis(){
	console.log("Movies");

	
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = secondCommand;
	};

	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=short&apikey=trilogy';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body).Title);
	        console.log("Year: " + JSON.parse(body).Year);
	        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	        console.log("Country: " + JSON.parse(body).Country);
	        console.log("Language: " + JSON.parse(body).Language);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body).Actors);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
	    }
    });
};

function doIt(){
	console.log("Looking at random.txt");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{

     	var dataArr = data.split(',');
        userCommand = dataArr[0];
        secondCommand = dataArr[1];
        
        for(i=2; i<dataArr.length; i++){
            secondCommand = secondCommand + "+" + dataArr[i];
        };
        
		 Switch();
		
    	};

    });

};

Switch();

