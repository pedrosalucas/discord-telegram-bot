const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const telegramChatSchema = mongoose.Schema({
	_id: reqString,
	guildIdDisc: reqString,
	channelIdDisc: reqString,
	token: reqString,
	titleDisc: String,
});

module.exports = mongoose.model('telegram-channels', telegramChatSchema);