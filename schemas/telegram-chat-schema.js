const mongoose = require('mongoose');

const reqNumber = {
	type: Number,
	required: true,
};

const telegramChatSchema = mongoose.Schema({
	_id: reqNumber,
	guildIdDisc: reqNumber,
	channelIdDisc: reqNumber,
	token: {
		type: String,
		required: true,
	},
	titleDisc: String,
});

module.exports = mongoose.model('telegram-channels', telegramChatSchema);