const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const discordGuildsSchema = mongoose.Schema({
	_id: reqString,
	channelIdDisc: reqString,
	token: reqString,
	chatIdTele: String,
	titleTele: String,
	titleDisc: reqString,
});

module.exports = mongoose.model('discord-channels', discordGuildsSchema);