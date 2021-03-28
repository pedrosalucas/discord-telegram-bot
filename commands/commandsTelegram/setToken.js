const mongo = require('../../mongo');
const telegramChatSchema = require('../../schemas/telegram-chat-schema');

module.exports = {
	name: 'setToken',
	description: 'Setting token',
	async execute(botTelegram, msg, chatId, token) {
		if (!token) {
			botTelegram.sendMessage(chatId, 'Plesae insert a token at command.');
			return;
		}
		const guildId = token.split('-')[0];
		const channelIdD = token.split('-')[1];
		console.log('Token: ' + token);

		let result;

		await mongo().then(async (mongoose) => {
			try {
				result = await telegramChatSchema.findOneAndUpdate({
					_id: chatId,
				}, {
					_id: chatId,
					guildIdDisc: guildId,
					channelIdDisc: channelIdD,
					token: '',
					titleDisc: 'Title',
				}, {
					upsert: true,
				});
			} catch (err) {
				console.error(err);
				botTelegram.sendMessage(chatId, 'Sorry, the process failed.');
			} finally {
				mongoose.connection.close();
			}
		});

		if (result) {
			console.log(result);
			botTelegram.sendMessage(chatId, `You sync with ${result.titleDisc} Discord Guild.`);
		}
	},
};