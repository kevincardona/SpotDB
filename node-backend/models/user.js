const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const config        = require('../config');

const userSchema = new Schema({
    spotify_id: String,
    username: String,
    spotify_token: String,
    spotify_refresh_token: String,
    location: {
        latlon: [Number],
        zip: String
    },
    top_artists: [{
        id: String,
        name: String
    }],
    top_tracks: [{
        id: String,
        name: String
    }],
    last_song: String

})

mongoose.connect(config.mongo_url);

const User = mongoose.model('User', userSchema);
exports.User = User;
