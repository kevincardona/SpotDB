var request = require('request')
var config      = require('../config');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
const UserModel = require('../models/user.js').User;
const querystring = require('querystring')
mongoose.connect(config.mongo_url);
mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var spotify_client_id = process.env.SPOTIFY_API_ID;
var spotify_client_secret = process.env.SPOTIFY_API_SECRET;
var access_token;
var refresh_token;
var expires_in;
var userName;
var birthday;
var followers;
var following;

var login = (req, res) => {
    var scopes = 'user-read-private user-read-email user-read-birthdate user-read-email playlist-read-private user-library-read user-library-modify user-top-read playlist-read-collaborative playlist-modify-public playlist-modify-private user-follow-read user-follow-modify user-read-playback-state user-read-currently-playing user-modify-playback-state user-read-recently-played'
    
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + spotify_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent('http://localhost:3000/authorized'));
}

var authorized = (req, res) => {
    console.log(req.body);
    console.log('code '  + req.body.code + ' test2 ' + req.query.code)
    var options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.body.code,
            redirect_uri: 'http://localhost:3000/authorized',
            grant_type: 'authorization_code',
            client_id: spotify_client_id,
            client_secret: spotify_client_secret
        },
        json: true
    }

    request.post(options, function(error, response, body) {
        //console.log(response.body)
        if (error) {
            return res.json({success: false, err: error})
        }
        access_token = response.body.access_token;
        refresh_token = response.body.refresh_token;
        expires_in = response.body.expires_in;

        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': "Bearer " + access_token
            },
            json: true
        }
        request.get(options, (error, response1, body) => {
            if (error) {
                return res.json({success: false, err: error})
            }

            UserModel.findOne({spotify_id: response1.body.id}, function(error, result) {
                if (!error) {
                    // If the document doesn't exist
                    if (!result) {
                        // Create it
                        result = new UserModel();
                        result.spotify_id = response1.body.id;
                        result.username = response1.body.display_name;
                    }
                    result.token = response.body.access_token;
                    // Save the document
                    result.save(function(error) {
                        if (!error) {
                            return res.json({success: true, token: response.body.access_token, id: response1.body.id, display_name: response1.body.display_name}); 
                        } else {
                            throw error;
                        }
                    });
                }
            });
            
             
        })
    })
}

var saveSong = (req, res) => {
    var songId = querystring.stringify(req.query)
    songId = songId.substring(6, songId.length-3) //FIGURE OUT ACTUAL SUBSTRING INDICES
    var options = {
        url: 'https://api.spotify.com/v1/me/tracks/'+songId,
        headers: {
            'Authorization': "Bearer " + req.header('token')
        },
        json: true
    }
    request.post(options, function(error, response, body) {
        if (error) {
            return res.json({success: false, err: error})
        }
        console.log(response.body)
    })
}

var library = (req, res) => {
    var options = {
        url: 'https://api.spotify.com/v1/me/tracks?market=ES',
        headers: {
            'Authorization': "Bearer " + req.header('token')
        },
        json: true
    }
    request.get(options, (error, response, body) => {
        //console.log(body)
        if (error) {
            return res.json({success: false, loggedin: false, error: error});
        }
        console.log(body);
        return res.json({success: true, user: body})
    })
}

var get = (req, res) => {
    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': "Bearer " + req.header('token')
        },
        json: true
    }
    request.get(options, (error, response, body) => {
        //console.log(body)
    })
}

var accountInfo = (req, res) => {
    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': "Bearer " + req.header('token')
        },
        json: true
    }
    request.get(options, (error, response, body) => {
        //console.log(body)
        if (error) {
            return res.json({success: false, loggedin: false, error: error});
        }
        return res.json({success: true, user: body})
    })
}

var search = (req, res) => {
    var queryStr = querystring.stringify(req.query)
    queryStr = queryStr.substring(6, queryStr.length-3)
    //console.log(queryStr)
    var options = {
        url: 'https://api.spotify.com/v1/search?q='+queryStr+'&type=artist',
        headers: {
            'Authorization': "Bearer " + req.header('token')
        },
        json: true
    }
    //console.log(options.url)
    request.get(options, (error, response, body) => {
        console.log(body.artists)
        if (error) {
            return res.json({success: false, error: error});
        } 
        return res.json({success: true, user: body.artists})
    })
}

var artist = (req, res) => {
    var queryStr = querystring.stringify(req.query)
    queryStr = queryStr.substring(6, queryStr.length-3)
    console.log(queryStr)
    //queryStr = queryStr.substring(6, queryStr.length-3)
    //console.log(queryStr)
    var options = {
        url: 'https://api.spotify.com/v1/artists/'+queryStr,
        headers: {
            'Authorization': "Bearer " + req.header('token')
        },
        json: true
    }
    //console.log(options.url)
    request.get(options, (error, response, body) => {
        //console.log(body)
        if (error) {
            return res.json({success: false, error: error});
        } 
        return res.json({success: true, user: body})
    })
}

var topArtists = (req, res) => {
    var options = {
        url: 'https://api.spotify.com/v1/me/top/artists',
        headers: {
            'Authorization': "Bearer " + req.header('token')
        },
        json: true
    }
    //console.log(options.url)
    request.get(options, (error, response, body) => {
        //console.log(body)
        if (error) {
            return res.json({success: false, error: error});
        } 
        return res.json({success: true, user: body})
    })
}


module.exports = {
    login: login,
    search: search,
    authorized: authorized,
    accountInfo: accountInfo,
    artist: artist,
    topArtists: topArtists,
    library: library,
    saveSong: saveSong
}
