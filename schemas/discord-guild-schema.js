const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const discordGuilsSchema = mongoose.Schema({
	_id: reqString,
	channelIdDisc: reqString,
	token: reqString,
	channelIdTele: String,
	titleTele: String,
});

module.exports = mongoose.model('discord-channels', discordGuilsSchema);