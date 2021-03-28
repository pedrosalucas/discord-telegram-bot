const mongoose = require('mongoose');

const reqNumber = {
	type: Number,
	required: true,
};

const discordGuilsSchema = mongoose.Schema({
	_id: reqNumber,
	channelIdDisc: reqNumber,
	token: {
		type: String,
		required: true,
	},
	channelIdTele: Number,
	titleTele: String,
});

module.exports = mongoose.model('discord-channels', discordGuilsSchema);